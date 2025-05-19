const crypto = require('crypto');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto según tu proveedor de correo
    auth: {
        user: 'laboratoriosoft17@gmail.com',
        pass: 'rwrb vrlc necc zrdz'
        // pass: 'Laboratorio2025Soft'
    }
});

const getInvoice = (req, res) => {
    const randomString = crypto.randomBytes(16).toString('hex');
    res.send(randomString);
}

const validatePayment = (req, res) => {
    const data = req.body;
    if (data.x_response === "Aceptada") {
        transporter.sendMail({
            from: 'laboratoriosoft17@gmail.com',
            to: 'laboratoriosoft17@gmail.com',
            subject: 'Pago aceptado',
            text: `El pago ha sido aceptado. Detalles:\n\n${JSON.stringify(data, null, 2)}`,
        }, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
            } else {
                console.log('Correo enviado:', info.response);
            }
        }
        );
    }
    res.sendStatus(200);
}

module.exports = {
    validatePayment,
    getInvoice
}