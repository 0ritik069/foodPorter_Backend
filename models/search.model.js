const pool = require('../config/db');

const SearchModel= {
    searchRestaurantsAndDishes: async (keyword) =>{
        const likeKeyword = `%${keyword}%`;

        const [restaurants] = await pool.query(
            `
    Select id, name, image, rating from restaurants Where name like ?            
            `, [likeKeyword]
        );

        const [dishes] = await pool.query(
            `
            Select id, name, image, price from dishes where name like ?`,
            [likeKeyword]
        )
        return {
            restaurants,
           dishes
        }
    }
};

module.exports = SearchModel;
