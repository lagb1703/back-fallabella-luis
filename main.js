const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/', function (req, res, next) {
    res.send("esto es una prueba de api")
})

app.listen(8000, ()=>{
    console.log("El demonio ha despertado en el puerto 8000")
})