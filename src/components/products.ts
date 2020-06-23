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

const getFilterSql = (filter :string ) :string => {
    switch (filter) {
        case 'recent':
            return 'ORDER BY date DESC';
        case 'older':
            return 'ORDER BY date ASC';
        case 'nostock':
            return 'AND available = false ORDER BY id ASC';
        default:
            return 'ORDER BY id ASC';
    }
}

export const getProducts = async (database :Database, searchName :string, filter :string, limit :number = 10, from :number = 0) :Promise<TProduct[]> => {
    // this implementation is better performant than using offset
    let searchNameSql = searchName ? "title LIKE '%" + searchName + "%' AND " : '';
    const filterSql = getFilterSql(filter);
    let sql = `select id, title, description, date, categories, available, is_featured from products where ${searchNameSql}oid not in ( select oid from products order by id asc limit ${from}) ${filterSql} limit ${limit}`;
    //console.log("executing query: \n", sql);
    return await database.all(sql);
};

export const getFeaturedProducts = async (database :Database) :Promise<TProduct[]> => {
    return await database.all("select * from products where products.is_featured = true;");
};

export const getProductsCount = async (database :Database, searchName :string, filter :string) :Promise<number> => {
    const filterSql = getFilterSql(filter);
    let sql = `select count(*) as count from products${searchName ? " where title LIKE '%" + searchName + "%'" : ' where 1=1'} ${filterSql};`
    return (await database.get(sql)).count || 0;
};