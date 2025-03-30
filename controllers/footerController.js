const mongoClient = require('../config/mongoConection');

const DATABASE = process.env.DB_DATABASE;

const footerController = async (req, res)=>{
    try {
        const client = await mongoClient();
        const db = client.db(DATABASE);
        const collection = db.collection('CO_FooterMenu');
        const footer = await collection.find({}).toArray();
        res.status(200).json(footer);
    } catch (error) {
        console.log(error);
        res.status(500).json({error});
    }
};

module.exports = {footerController};