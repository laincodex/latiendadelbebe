import { Database } from "sqlite";

export interface TBanner {
    id :number, 
    image_url :string,
    label :string
};

export interface BannerPosition {
    banner_id :number,
    position :number
}

export const getBanners = async (database :Database) :Promise<TBanner[]> => {
    return await database.all("select banners.id, image_url, label from banners inner join banners_positions on banners.id=banners_positions.id;");
};

export const newBanner = async (database :Database, banner :TBanner) :Promise<TBanner> => {
    return await database.run(`INSERT INTO banners(image_url, label) VALUES('${banner.image_url}', '${banner.label}');`)
    .then(async res => {
        const id = await database.get("SELECT last_insert_rowid() as id;");
        banner.id = id;
        return banner;
    })
};

export const updateBanners = async (database :Database, source :TBanner[], destination :TBanner[]) :Promise<void | void[]> => {
    const sqlQueryStack :string[] = [];
    const newBannersPromises :(Promise<TBanner> | TBanner)[] = [];

    destination.forEach(banner => {
        const index = source.findIndex(s => s.id === banner.id);
        if (index !== -1) {
            // banner exist, check if has changed
            const imageUrlChanged = source[index].image_url !== banner.image_url;
            const labelChanged = source[index].label !== banner.label;
            if (imageUrlChanged || labelChanged ) {
                let query :string = "UPDATE banners SET ";
                if(imageUrlChanged)
                    query += `image_url='${banner.image_url}' `;
                if(labelChanged)
                    query += `label='${banner.label}' `;
                query += `WHERE banners.id = ${banner.id};`;
                sqlQueryStack.push(query);
            }
            newBannersPromises.push(banner);
        } else {
            // banner is new, we need to create a new entry in the db before update here
            newBannersPromises.push(newBanner(database, banner));
        }
    })

    source.forEach(banner => {
        const index = destination.findIndex(d => d.id === banner.id);
        if (index === -1) {
            // banner has been removed
            sqlQueryStack.push(`DELETE FROM banners WHERE banners.id = '${banner.id}';`);
        }
    })

    const updatedBanners :TBanner[] = await Promise.all(newBannersPromises);
    if (updatedBanners.length > 0) {
        // Clear positions table
        sqlQueryStack.push("DELETE FROM banners_positions; VACUUM;");
        let updatePositionsQuery :string = "INSERT INTO banners_positions VALUES ";
        for (let i = 0; i < updatedBanners.length; i++) {
            updatePositionsQuery += `('${updatedBanners[i].id}')`;
            if(i < updatedBanners.length-1)
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
