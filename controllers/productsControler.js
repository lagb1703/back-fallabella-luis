const mongoClient = require('../config/mongoConection');
const { ObjectId } = require('mongodb');

const DATABASE = process.env.DB_DATABASE;

const getProductByObjectId = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'id es requerido' });
    }
    if (typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'id debe ser un string' });
    }
    try {
        const client = await mongoClient();
        const db = client.db(DATABASE);
        const collection = db.collection('CO_Productos');
        const Product = await collection.findOne({ _id: new ObjectId(id) });
        res.status(200).json(Product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

const getProductByCategoryId = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: 'id es requerido' });
    }
    if (typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'id debe ser un string' });
    }
    try {
        const client = await mongoClient();
        const db = client.db(DATABASE);
        const collection = db.collection('CO_Productos');
        const footer = await collection.aggregate([
            {
            $match: {
                categorias: { $all: [id] }
            }
            },
            {
            $project: {
                _id: 1,
                nombre: 1,
                precio: 1,
                descuento: 1,
                cantidad: 1,
                imagenes: 1,
                calificacion: { $avg: "$comentarios.calificacion" }
            }
            }
        ]).toArray();
        res.status(200).json(footer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

module.exports = { getProductByObjectId, getProductByCategoryId };