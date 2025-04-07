const mongoClient = require('../config/mongoConection');
const { ObjectId } = require('mongodb');
const pool = require('../config/conectbd');

const DATABASE = process.env.DB_DATABASE;

const PRODUCTLIMIT = 56;

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
        const product = await collection.aggregate([
            {
                $match: {
                    _id: new ObjectId(id)
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
                    marca: 1,
                    envioGratis: 1,
                    patrocinado: 1,
                    informacionAdicional: 1,
                    especificaciones: 1,
                    comentarios: 1,
                    calificacion: { $avg: "$comentarios.calificacion" },
                }
            }
        ]).toArray();
        res.status(200).json(product[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

const getProductsNumberByCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await mongoClient();
        const db = client.db(DATABASE);
        const collection = db.collection('CO_Productos');
        const count = await collection.countDocuments({ categorias: { $all: [id] } });
        res.status(200).json(count);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const getAllMarcaByCategoryId = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await mongoClient();
        const db = client.db(DATABASE);
        const collection = db.collection('CO_Productos');
        const marcas = await collection.aggregate([
            {
                $match: {
                    categorias: {
                        $all: [id]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    marcas: { $addToSet: "$marca" }
                }
            },
            {
                $project: {
                    _id: 0,
                    marcas: 1
                }
            }
        ]).toArray();
        res.status(200).json(marcas[0]["marcas"]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const getProductByCategoryId = async (req, res) => {
    const { id } = req.params;
    const { page = "1" } = req.query;
    const {
        marca,
        minPrice,
        maxPrice,
    } = req.body;
    console.log(marca);
    if (!id) {
        return res.status(400).json({ success: false, message: 'id es requerido' });
    }
    if (typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'id debe ser un string' });
    }
    if (page < 1) {
        return res.status(400).json({ success: false, message: 'page debe ser mayor que 0' });
    }
    if (!marca && marca != "") {
        return res.status(400).json({ success: false, message: 'marca es requerido' });
    }
    if (typeof marca !== 'string') {
        return res.status(400).json({ success: false, message: 'marca debe ser un string' });
    }
    let match = {
        categorias: { $all: [id] }
    }
    if (marca.length > 0) {
        match.marca = marca;
    }
    if (!maxPrice && maxPrice != 0) {
        return res.status(400).json({ success: false, message: 'maxPrice es requerido' });
    }
    if (typeof maxPrice !== 'number') {
        return res.status(400).json({ success: false, message: 'maxPrice debe ser un numero' });
    }
    if (!minPrice && minPrice != 0) {
        return res.status(400).json({ success: false, message: 'minPrice es requerido' });
    }
    if (typeof minPrice !== 'number') {
        return res.status(400).json({ success: false, message: 'minPrice debe ser un numero' });
    }
    if (minPrice > maxPrice) {
        return res.status(400).json({ success: false, message: 'minPrice debe ser menor que maxPrice' });
    }
    if (minPrice > 0 && maxPrice > 0) {
        match.precio = { $gte: minPrice, $lte: maxPrice }
    }
    try {
        const client = await mongoClient();
        const db = client.db(DATABASE);
        const collection = db.collection('CO_Productos');
        const products = await collection.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    _id: 1,
                    nombre: 1,
                    precio: 1,
                    descuento: 1,
                    cantidad: 1,
                    imagenes: 1,
                    marca: 1,
                    envioGratis: 1,
                    patrocinado: 1,
                    calificacion: { $avg: "$comentarios.calificacion" },
                }
            },
            {
                $skip: (parseInt(page) - 1) * PRODUCTLIMIT
            },
            {
                $limit: PRODUCTLIMIT
            }
        ]).toArray();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

const getCategoryNameByCategoryId = async (req, res) => {
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
        const collection = db.collection('CO_Categoria');
        const category = await collection.aggregate([
            {
                $match: {
                    _id: new ObjectId(id)
                }
            },
            {
                $project: {
                    _id: 0,
                    Categoria: 1
                }
            }
        ]).toArray();
        res.status(200).json(category[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const getMinPriceByCategoryId = async (req, res) => {
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
        const minPrice = await collection.aggregate([
            {
                $match: {
                    categorias: { $all: [id] }
                }
            },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$precio" }
                }
            },
            {
                $project: {
                    _id: 0,
                    minPrice: 1
                }
            }
        ]).toArray();
        res.status(200).json(minPrice[0]["minPrice"]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const getMaxPriceByCategoryId = async (req, res) => {
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
        const maxPrice = await collection.aggregate([
            {
                $match: {
                    categorias: { $all: [id] }
                }
            },
            {
                $group: {
                    _id: null,
                    maxPrice: { $max: "$precio" }
                }
            },
            {
                $project: {
                    _id: 0,
                    maxPrice: 1
                }
            }
        ]).toArray();
        res.status(200).json(maxPrice[0]["maxPrice"]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const getCart = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'id es requerido' });
    }
    if (typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'id debe ser un string' });
    }
    const sqlQuery = `
        SELECT 
            carrito_id, 
            producto_id
        FROM productos."TB_Carrito" 
            WHERE usuario_id = $1`;
    try {
        const queryResponse = (await pool.query(sqlQuery, [id])).rows;
        res.status(200).json(queryResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const saveProductsToCart = async (req, res) => {
    const { id } = req.query;
    const { products } = req.body;
    if (!id) {
        return res.status(400).json({ success: false, message: 'id es requerido' });
    }
    if (typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'id debe ser un string' });
    }
    if (!products) {
        return res.status(400).json({ success: false, message: 'products es requerido' });
    }
    if (!Array.isArray(products)) {
        return res.status(400).json({ success: false, message: 'products debe ser un array' });
    }
    const sqlQuery = `call productos."SP_PRODUCTOSPKG_AGREGARCARRITO"($1, $2)`;
    const response = []
    try{
        for(const product of products){
            const params = {
                userId: id,
                productId: product.id,
                cantidad: product.cantidad,
            }
            const queryResponse = (await pool.query(sqlQuery, [JSON.stringify(params), 0])).rows[0]['p_id'];
            response.push({carrito_id: queryResponse, producto_id: product.id});
        }
        response.sort()
        res.status(200).json(response);
    }catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

module.exports = {
    getProductByObjectId,
    getProductByCategoryId,
    getProductsNumberByCategory,
    getAllMarcaByCategoryId,
    getCategoryNameByCategoryId,
    getMinPriceByCategoryId,
    getMaxPriceByCategoryId,
    getCart,
    saveProductsToCart,
};