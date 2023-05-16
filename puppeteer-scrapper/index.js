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

app.get('/:busqueda', async (req, res) => {
  try {
    //const resultadoAmazon = await amazon.busquedaAmazon("percy jackson");
    //const resultadoIberLibros = await iber.busquedaIberLibro("percy jackson");

    const listaIberLibro = [
      {
        titulo: "El nombre del viento",
        autor: "Patrick Rothfuss",
        isbn: "9788401352836",
        editorial: "Penguin Random House Grupo Editorial España",
        fechaPublicacion: "2008-03-10",
        precio: 20.0,
        precioMoneda: "EUR"
      },
      {
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        isbn: "9788420471839",
        editorial: "Penguin Random House Grupo Editorial España",
        fechaPublicacion: "1967-06-05",
        precio: 10.0,
        precioMoneda: "USD"
      }
    ];
    
    const listaAmazon = [
      {
        titulo: "El nombre del viento",
        autor: "Patrick Rothfuss",
        isbn: "9788401352836",
        editorial: "Editorial Planeta",
        fechaPublicacion: "2010-02-01",
        precio: 15.0,
        precioMoneda: "USD"
      },
      {
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        isbn: "9788420471839",
        editorial: "Cien años de soledad",
        fechaPublicacion: "2014-05-30",
        precio: 12.0,
        precioMoneda: "EUR"
      }
    ];
    
    //const resultado = {
    //  "busquedaAmazon": JSON.parse(resultadoAmazon),
    //  "busquedaIberLibros": JSON.parse(resultadoIberLibros)
    //};

    const resultado = {
        "busquedaAmazon": listaAmazon,
        "busquedaIberLibros": listaIberLibro
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
