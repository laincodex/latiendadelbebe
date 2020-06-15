import { Database } from "sqlite";
import fs from "fs";

export interface TCarouselItem {
    id :number, 
    image_url :string,
    label :string
};

export interface CarouselPosition {
    carousel_id :number,
    position :number
}

export const CAROUSEL_UPLOAD_PATH :string = "/public/upload/carousel/"; // Must start and end with a slash -> /

export const getCarouselItems = async (database :Database) :Promise<TCarouselItem[]> => {
    return await database.all("select carousel.id, image_url, label from carousel inner join carousel_positions on carousel.id=carousel_positions.id;");
};

export const newCarouselItem = async (database :Database, carousel :TCarouselItem) :Promise<TCarouselItem> => {
    await database.run('INSERT INTO carousel(image_url, label) VALUES(?, ?);', carousel.image_url, carousel.label);
    const res = await database.get("SELECT last_insert_rowid() as id;");
    carousel.id = res.id;
    return carousel;
};

const moveTmpImage = (src :string, callback? :Function) => {
    if (src !== "") {
        const destCarouselImage = src.replace(/^tmp\//, "");
        const srcImagePath = __dirname + CAROUSEL_UPLOAD_PATH + src;
        fs.exists(srcImagePath, (exists) => {
            if(exists) {
                fs.rename(srcImagePath, __dirname + CAROUSEL_UPLOAD_PATH + destCarouselImage, err => {
                    if (err) {
                        console.log("Error moving temporal carousel image...", err);
                    } else {
                        if(callback) {
                            callback();
                        }
                    }
                });
            }
        });
    }
}

export const updateCarouselItems = async (database :Database, source :TCarouselItem[], destination :TCarouselItem[]) :Promise<TCarouselItem[]> => {
    const sqlQueryStack :string[] = [];
    const updatedCarousel :TCarouselItem[] = [];

    // We need to be sync in ordert to get a correct last_insert_rowid() for new images
    for (let destIndex = 0; destIndex < destination.length; destIndex++) {
        const index = source.findIndex(s => s.id === destination[destIndex].id);
        if (index !== -1) {
            // exist, check if has changed
            const imageUrlChanged = source[index].image_url !== destination[destIndex].image_url;
            const labelChanged = source[index].label !== destination[destIndex].label;
            if (imageUrlChanged || labelChanged ) {
                let query :string = "UPDATE carousel SET ";
                if(imageUrlChanged) {
                    const newCarouselImageUrl = destination[destIndex].image_url.replace(/^tmp\//, "");
                    moveTmpImage(destination[destIndex].image_url, () => {
                        // remove old image
                        if (source[index].image_url !== "") {
                            const imagePath = __dirname + CAROUSEL_UPLOAD_PATH + source[index].image_url;
                            fs.exists(imagePath, (exists) => {
                                if(exists) {
                                    fs.unlink(imagePath, err => {
                                        if (err)
                                            console.log("Error deleting old carousel image...", source[index].image_url, err);
                                    });
                                }
                            });
                        }
                    });
                    query += `image_url='${newCarouselImageUrl}' `;
                    destination[destIndex].image_url = newCarouselImageUrl;
                }
                if(labelChanged) {
                    query += `label='${destination[destIndex].label}' `;
                }
                query += `WHERE carousel.id = ${destination[destIndex].id};`;
                sqlQueryStack.push(query);
            }
            updatedCarousel.push(destination[destIndex]);
        } else {
            // is new, we need to create a new entry in the db before update here
            moveTmpImage(destination[destIndex].image_url);
            destination[destIndex].image_url = destination[destIndex].image_url.replace(/^tmp\//, "");
            const newItem :TCarouselItem = await newCarouselItem(database, destination[destIndex]);
            updatedCarousel.push(newItem);
        }
    }
    source.forEach(carouselItem => {
        const index = destination.findIndex(d => d.id === carouselItem.id);
        if (index === -1) {
            // carousel item has been removed
            if (carouselItem.image_url !== "") {
                const imagePath = __dirname + CAROUSEL_UPLOAD_PATH + carouselItem.image_url;
                fs.exists(imagePath, (exists) => {
                    if(exists) {
                        fs.unlink(imagePath, err => {
                            if(err)
                                console.log("Error deleting previously removed image", carouselItem.image_url, err);
                        });
                    }
                });
            }
            sqlQueryStack.push(`DELETE FROM carousel WHERE carousel.id = '${carouselItem.id}';`);
        }
    })

    // Clear positions table
    sqlQueryStack.push("DELETE FROM carousel_positions; VACUUM;");
    if(updatedCarousel.length > 0) {
        let updatePositionsQuery :string = "INSERT INTO carousel_positions VALUES ";
        for (let i = 0; i < updatedCarousel.length; i++) {
            updatePositionsQuery += `('${updatedCarousel[i].id}')`;
            if(i < updatedCarousel.length-1)
                updatePositionsQuery += ', '
        }
        updatePositionsQuery += ";";
        sqlQueryStack.push(updatePositionsQuery);
    }

    // run query stack
    const sqlQueryStackPromises :Promise<void>[] = [];
    sqlQueryStack.forEach(query => sqlQueryStackPromises.push(database.exec(query)));
    
    //return await Promise.all(sqlQueryStackPromises);
    await Promise.all(sqlQueryStackPromises);
    return updatedCarousel;
};