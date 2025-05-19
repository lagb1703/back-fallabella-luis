const pool = require('../config/conectbd');
const changeBasicInformation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, firstLastName, secondLastName } = req.body;
        if(!name || !firstLastName) {
            return res.status(400).json({ message: 'Rellene todos los campos' });
        }
        if(!id) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado' });
        }
        if(typeof id !== 'string') {
            return res.status(400).json({ message: 'ID de usuario debe ser una cadena' });
        }
        if(Number.isNaN(Number(id))) {
            return res.status(400).json({ message: 'ID de usuario debe ser un número' });
        }
        if(typeof name !== 'string' || typeof firstLastName !== 'string') {
            return res.status(400).json({ message: 'Los nombres y apellidos deben ser cadenas' });
        }
        const query = 'UPDATE usuarios."TB_Usuarios" SET nombres = $1, apellidos = $2 WHERE usuario_id = $3 RETURNING *';
        const result = await pool.query(query, [name, `${firstLastName} ${secondLastName}`, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({
            message: 'Información actualizada correctamente',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

module.exports = { changeBasicInformation };