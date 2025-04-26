const nodemailer = require('nodemailer');
const { randomInt } = require('crypto'); // Para generar el PIN
const bcrypt = require('bcrypt'); // Para hashear la contraseña
const pool = require('../config/conectbd');

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto según tu proveedor de correo
    auth: {
        user: 'laboratoriosoft17@gmail.com',
        pass: 'rwrb vrlc necc zrdz'
        // pass: 'Laboratorio2025Soft'
    }
});

// Función para generar un PIN de 6 dígitos
function generatePin() {
    return randomInt(100000, 999999).toString(); // Genera un número entre 100000 y 999999
}

// Controlador para solicitar un cambio de contraseña
const requestChangePassword = async (req, res) => {
    const { correo } = req.body;

    try {
        // Verificar si el usuario existe en la base de datos
        const userQuery = await pool.query(
            'SELECT * FROM usuarios."TB_Usuarios" WHERE correo = $1',
            [correo]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Generar el PIN
        const pin = generatePin();

        // Guardar el PIN y su fecha de expiración en la base de datos
        await pool.query(
            'UPDATE usuarios."TB_Usuarios" SET pin_validacion = $1, pin_expira = NOW() + INTERVAL \'7 minutes\' WHERE correo = $2',
            [pin, correo]
        );

        // Enviar el correo electrónico con el PIN
        const mailOptions = {
            from: 'laboratoriosoft17@gmail.com',
            to: correo,
            subject: 'PIN de validación para cambio de contraseña',
            text: `Tu PIN de validación es: ${pin}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).json({ error: 'Error al enviar el correo' });
            }
            res.status(200).json({ message: 'PIN enviado al correo electrónico' });
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const validationPin = async (req, res) => {
    const { correo, pin } = req.body;

    try {
        // Verificar si el usuario existe en la base de datos
        const userQuery = await pool.query(
            'SELECT * FROM usuarios."TB_Usuarios" WHERE correo = $1',
            [correo]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = userQuery.rows[0];

        // Verificar si el PIN es válido y no ha expirado
        if (user.pin_validacion === pin && new Date(user.pin_expira) > new Date()) {
            res.status(200).json({sucess: true, message: 'PIN válido' });
        } else {
            res.status(400).json({ error: 'PIN inválido o expirado' });
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const newPassword = async (req, res) => {
    const { correo, nueva_contrasena } = req.body;
    try {
        
        // 1. Verificar si el usuario existe
        const userQuery = await pool.query(
            'SELECT contrasena FROM usuarios."TB_Usuarios" WHERE correo = $1',
            [correo]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        const user = userQuery.rows[0];
        
        
        // 2. Comparar con la contraseña anterior
        const isSamePassword = await bcrypt.compare(nueva_contrasena, user.contrasena);

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña no puede ser igual a la anterior'
            });
        }

        // 3. Hashear y actualizar la nueva contraseña
        const saltRounds = 10;
        const hashedContrasena = await bcrypt.hash(nueva_contrasena, saltRounds);

        await pool.query(
            'UPDATE usuarios."TB_Usuarios" SET contrasena = $1 WHERE correo = $2',
            [hashedContrasena, correo]
        );

        res.status(200).json({ 
            success: true,
            message: 'Contraseña cambiada exitosamente' 
        });

    } catch (error) {
        console.error('Error en newPassword:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error en el servidor al actualizar la contraseña'
        });
    }
};

module.exports = {
    requestChangePassword,
    validationPin,
    newPassword
};