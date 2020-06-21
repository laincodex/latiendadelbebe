import { Database } from "sqlite";
import fs from "fs"

export interface TProduct {
    id :number,
    title :string,
    description :string,
    date :number,
    categories :number[],
    available :boolean,
    is_featured :boolean
};

export const getProducts = async (database :Database, limit :number = 10, from :number = 0) :Promise<TProduct[]> => {
    // this implementation is better performant than using offset
    let sql = `select id, title, description, date, categories, available, is_featured from products where oid not in ( select oid from products order by id asc limit ${from}) order by id asc limit ${limit}`;
    return await database.all(sql);
};

export const getFeaturedProducts = async (database :Database) :Promise<TProduct[]> => {
    return await database.all("select * from products where products.is_featured = true;");
};

export const getProductsCount = async (database :Database) :Promise<number> => {
    return (await database.get("select count(*) as count from products;")).count || 0;
};