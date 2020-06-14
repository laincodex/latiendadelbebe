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

export const getCarouselItems = async (database :Database) :Promise<TCarouselItem[]> => {
    return await database.all("select carousel.id, image_url, label from carousel inner join carousel_positions on carousel.id=carousel_positions.id;");
};

export const newCarouselItem = async (database :Database, carousel :TCarouselItem) :Promise<TCarouselItem> => {
    return await database.run('INSERT INTO carousel(image_url, label) VALUES(?, ?);', carousel.image_url, carousel.label)
    .then(async () => {
        const res = await database.get("SELECT last_insert_rowid() as id;");
        carousel.id = res.id;
        return carousel;
    })
};

export const updateCarouselItems = async (database :Database, source :TCarouselItem[], destination :TCarouselItem[]) :Promise<void | void[]> => {
    const sqlQueryStack :string[] = [];
    const newCarouselPromises :(Promise<TCarouselItem> | TCarouselItem)[] = [];

    destination.forEach(carouselItem => {
        const index = source.findIndex(s => s.id === carouselItem.id);
        if (index !== -1) {
            // exist, check if has changed
            const imageUrlChanged = source[index].image_url !== carouselItem.image_url;
            const labelChanged = source[index].label !== carouselItem.label;
            if (imageUrlChanged || labelChanged ) {
                let query :string = "UPDATE carousel SET ";
                if(imageUrlChanged) {

                    // BUG - sometimes get weird and try to remove an old image, maybe I should test with sync.

                    // const carouselImageTmpPath = options.carouselImagesTmpPath + "/" + carouselItem.image_url;
                    // const carouselImagePath
                    const carouselImageTmpPath = __dirname + "/public/upload/carousel/" + carouselItem.image_url;
                    const newCarouselImageUrl = carouselItem.image_url.replace(/^tmp\//, "");
                    fs.rename(carouselImageTmpPath, __dirname + "/public/upload/carousel/" + newCarouselImageUrl, err => {
                        if (err) {
                            console.log("Error moving temporal carousel image...", err);
                        } else {
                            // remove old image
                            fs.unlink(__dirname + "/public/upload/carousel/" + source[index].image_url, err => {
                                if (err)
                                    console.log("Error deleting old carousel image...", err);
                            });
                        }
                    });

                    query += `image_url='${newCarouselImageUrl}' `;
                }
                if(labelChanged)
                    query += `label='${carouselItem.label}' `;
                query += `WHERE carousel.id = ${carouselItem.id};`;
                sqlQueryStack.push(query);
            }
            newCarouselPromises.push(carouselItem);
        } else {
            // is new, we need to create a new entry in the db before update here
            newCarouselPromises.push(newCarouselItem(database, carouselItem));
        }
    })

    source.forEach(carouselItem => {
        const index = destination.findIndex(d => d.id === carouselItem.id);
        if (index === -1) {
            // carousel item has been removed
            fs.unlink(__dirname + "/public/upload/carousel/"+carouselItem.image_url, err => {
                if(err)
                    console.log(err);
            });
            sqlQueryStack.push(`DELETE FROM carousel WHERE carousel.id = '${carouselItem.id}';`);
        }
    })

    const updatedCarousel :TCarouselItem[] = await Promise.all(newCarouselPromises);
    if (updatedCarousel.length > 0) {
        // Clear positions table
        sqlQueryStack.push("DELETE FROM carousel_positions; VACUUM;");
        let updatePositionsQuery :string = "INSERT INTO carousel_positions VALUES ";
        for (let i = 0; i < updatedCarousel.length; i++) {
            updatePositionsQuery += `('${updatedCarousel[i].id}')`;
            if(i < updatedCarousel.length-1)
                updatePositionsQuery += ', '
        }
        updatePositionsQuery += ";";
        sqlQueryStack.push(updatePositionsQuery);

        // run query stack
        const sqlQueryStackPromises :Promise<void>[] = [];
        sqlQueryStack.forEach(query => sqlQueryStackPromises.push(database.exec(query)));
        
        return await Promise.all(sqlQueryStackPromises);
    }
};