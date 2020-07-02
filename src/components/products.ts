import { Database } from "sqlite";
import fs from "fs"

export interface TProduct {
    id :number,
    title :string,
    description :string,
    date :number,
    categories :string,
    available :boolean,
    is_featured :boolean,
    primary_image_id :number
};

const getFilterSql = (filter :string ) :string => {
    switch (filter) {
        case 'recent':
            return 'ORDER BY date DESC';
        case 'older':
            return 'ORDER BY date ASC';
        case 'nostock':
            return 'AND available = false ORDER BY id ASC';
        case 'titledesc':
            return 'ORDER BY title DESC';
        case 'titleasc':
        default:
            return 'ORDER BY title ASC';
    }
};

export const getProductDetail = async (database :Database, id :number) :Promise<TProduct|undefined> => {
    const sql = 'SELECT id, title, description, date, categories, available, is_featured, primary_image_id from products WHERE id = ?';
    return await database.get(sql, id);
};

export const getProducts = async (database :Database, searchName :string, filter :string, limit :number = 10, from :number = 0) :Promise<TProduct[]> => {
    // this implementation is better performant than using offset
    let searchNameSql = searchName ? "title LIKE '%" + searchName + "%' AND " : '';
    const filterSql = getFilterSql(filter);
    let sql = `select id, title, description, date, categories, available, is_featured, primary_image_id from products where ${searchNameSql}oid not in ( select oid from products order by id asc limit ${from}) ${filterSql} limit ${limit}`;
    return await database.all(sql);
};

export const getFeaturedProducts = async (database :Database) :Promise<TProduct[]> => {
    return await database.all("select id, title, description, date, categories, available, is_featured, primary_image_id from products where products.is_featured = true;");
};

export const getProductsCount = async (database :Database, searchName :string, filter :string) :Promise<number> => {
    const filterSql = getFilterSql(filter);
    let sql = `select count(oid) as count from products${searchName ? " where title LIKE '%" + searchName + "%'" : ' where 1=1'} ${filterSql};`;
    return (await database.get(sql)).count || 0;
};

export const updateProduct = async (database :Database, id :number, fields :any) => {
    const updateSql :string[] = [];
    const productInterface = ["title", "description", "date", "categories", "available", "is_featured"];
    productInterface.forEach(f => {
        if (typeof fields[f] != 'undefined')
            updateSql.push(f + ' = ' + fields[f]);
    });
    if (updateSql.length == 0)
        throw("Empty fields body, cannot update" + id);
    let sql = `UPDATE products SET ${updateSql.join(',')} WHERE id = ?;`;
    return await database.run(sql, id);
};

export const deleteProduct = async (database :Database, id :number) => {
    const sql = 'DELETE FROM products WHERE id = ?;';
    return await database.run(sql, id);
};

export interface TProductImage {
    id :number,
    product_id :number,
    image_url :string
};

export const getProductImage = async (database :Database, id :number) :Promise<TProductImage | undefined> => {
    const sql = 'SELECT id, product_id, image_url FROM product_images WHERE id = ?;';
    return await database.get(sql, id);
};

export const getProductImages = async (database :Database, id :number) :Promise<TProductImage[]> => {
    const sql = 'SELECT id, image_url FROM product_images WHERE product_id = ?;';
    return await database.all(sql, id);
};

export const newProductImage = async (database :Database, productId :number, imageUrl :string) :Promise<TProductImage> => {
    const sql = 'INSERT INTO product_images(product_id, image_url) VALUES (?,?);';
    await database.run(sql, productId, imageUrl);
    const newImageId = await database.get("SELECT last_insert_rowid() as id;");
    return {
        id: newImageId.id,
        product_id: productId,
        image_url: imageUrl
    };
};

export const setProductPrimaryImage = async (database :Database, productId :number, imageId :number) => {
    const sql = 'UPDATE products SET primary_image_id = ? WHERE id = ?;';
    return await database.run(sql, imageId, productId);
}

export const deleteProductImage = async (database :Database, id :number) => {
    const sql = 'DELETE FROM product_images WHERE id = ?;';
    return await database.run(sql, id);
};

export interface TCategory {
    id :number,
    name :string
};
export const getCategories = async (database :Database) :Promise<TCategory[]> => {
    const sql = 'SELECT id, name FROM categories;';
    return await database.all(sql);
};