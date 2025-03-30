const AwsS3 = require("../config/awsS3");
const awsS3 = AwsS3.getInstance();
const PREFIX = 'images';
const getImage = async (req, res) => {
    const { key } = req.params;
    if (!key) {
        return res.status(400).json({ success: false, message: 'key es requerido' });
    }
    if (typeof key !== 'string') {
        return res.status(400).json({ success: false, message: 'key debe ser un string' });
    }
    if (key.includes('..')) {
        return res.status(400).json({ success: false, message: 'key no puede contener ..' });
    }
    if (key.includes('/')) {
        return res.status(400).json({ success: false, message: 'key no puede contener /' });
    }
    try {
        const data = await awsS3.getFile(PREFIX, key);
        res.setHeader('Content-Type', data.ContentType);
        res.setHeader('Content-Length', data.ContentLength);
        res.status(200);
        data.Body.pipe(res);
    } catch (err) {
        console.error('Error al obtener archivo:', err);
        res.status(404).json({ success: false, message: 'Error del servidor' });
    }
};

module.exports = {
    getImage,
};