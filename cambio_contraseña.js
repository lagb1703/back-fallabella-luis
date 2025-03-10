// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const client = require('./conectbd');
const { randomInt } = require('crypto'); // Para generar el PIN
const bcrypt = require('bcrypt'); // Para hashear la contraseña

client.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error de conexión', err));

const app = express();
app.use(bodyParser.json());

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto según tu proveedor de correo
    auth: {
        user: 'laboratoriosoft17@gmail.com',
        pass: 'Laboratorio2025Soft'
    }
});

// Función para generar un PIN de 6 dígitos
function generatePin() {
    return randomInt(100000, 999999).toString(); // Genera un número entre 100000 y 999999
}

// Endpoint para solicitar un cambio de contraseña
app.post('/request_cambio_contrasena', async (req, res) => {
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
            console.log('Correo enviado:', info.response);
            res.status(200).json({ message: 'PIN enviado al correo electrónico' });
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint para validar el PIN y cambiar la contraseña
app.post('/validar_pin', async (req, res) => {
    const { correo, pin, nueva_contrasena } = req.body;

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

        // Verificar el PIN y su expiración
        if (user.pin_validacion !== pin) {
            return res.status(400).json({ error: 'PIN inválido' });
        }

        if (user.pin_expira < new Date()) {
            return res.status(400).json({ error: 'PIN expirado' });
        }

        // Hashear la nueva contraseña
        const saltRounds = 10; // Número de rondas de hashing
        const hashedContrasena = await bcrypt.hash(nueva_contrasena, saltRounds);

        // Cambiar la contraseña hasheada en la base de datos
        await pool.query(
            'UPDATE usuarios."TB_Usuarios" SET contrasena = $1, pin_validacion = NULL, pin_expira = NULL WHERE correo = $2',
            [hashedContrasena, correo]
        );

        res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor de Node.js corriendo en http://localhost:${PORT}`);
});