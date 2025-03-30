const mongoClient = require('../config/mongoConection');

const DATABASE = process.env.DB_DATABASE;

const menuController = async (req, res)=>{
    try {
        const client = await mongoClient();
        const db = client.db(DATABASE);
        const collection = db.collection('CO_SlideBarMenu');
        const footer = await collection.find({}).toArray();
        res.status(200).json(footer);
    } catch (error) {
        console.log(error);
        res.status(500).json({error});
    }
};

const subMenuController = async (req, res)=>{
    try {
        const {menu_id} = req.params;
        if (!menu_id) {
            return res.status(400).json({ success: false, message: 'menu_id es requerido' });
        }
        if (typeof menu_id !== 'string') {
            return res.status(400).json({ success: false, message: 'menu_id debe ser un string' });
        }
        const client = await mongoClient();
        const db = client.db(DATABASE);
        const collection = db.collection('CO_SubMenu');
        const footer = await collection.find({menu_id:menu_id}).toArray();
        res.status(200).json(footer);
    } catch (error) {
        console.log(error);
        res.status(500).json({error});
    }
};

module.exports = {menuController, subMenuController};