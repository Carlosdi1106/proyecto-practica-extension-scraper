const express = require('express');
const puppeteer = require('puppeteer');
const amazon= require('./scraperAmazon.js');
const iber = require('./scraperIberLibros.js');

const app = express();
const port = 3001;

// Middleware para habilitar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permite el acceso desde cualquier dominio (*). Puedes ajustar esto según tus necesidades.
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos HTTP permitidos
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Cabeceras permitidas
  next();
});

app.get('/:busqueda/:modo', async (req, res) => {
  try {
    const resultadoAmazon = await amazon.busquedaAmazon(req.params.busqueda, req.params.modo);
    const resultadoIberLibros = await iber.busquedaIberLibro(req.params.busqueda);

  
    
    const resultado = {
      "busquedaAmazon": JSON.parse(resultadoAmazon),
      "busquedaIberLibros": JSON.parse(resultadoIberLibros)
    };

    let datos = JSON.stringify(resultado);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
