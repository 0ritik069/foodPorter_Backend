// const SearchModel = require('../models/search.modal');
const SearchModel = require('../models/search.model');

exports.search = async (req, res) => {
    try{
        const Keyword = req.query.q;

        if(!Keyword){
            return res.status(400).json({
                success: false,
                message: "Search keyword is required"
            });
        }
        const results = await SearchModel.searchRestaurantsAndDishes(Keyword);
        console.log("Search results:", results);
        
        res.status(200).json({
            success: true,
            message: "Search results fetched",
            data: results
        });


    }
    catch(error){
        console.error("Search error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
        
};