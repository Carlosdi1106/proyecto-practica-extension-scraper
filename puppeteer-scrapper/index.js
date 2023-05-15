const express = require('express');
const puppeteer = require('puppeteer');

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
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.iberlibro.com/');

  //confirmar que eres humano
  /*const cajaConfirmacion= await page.$('#challenge-stage > div > label > input[type=checkbox]');
  page.click(cajaConfirmacion)*/


  //busca la palabra deseada
  const searchBox =await page.$('#header-searchbox-input-m')
  stringDeBusqueda = req.params.busqueda;
  console.log(stringDeBusqueda);
  await searchBox.type(stringDeBusqueda)
  //await searchBox.type('percy jackson')
  
  await searchBox.press('Enter')
  await page.waitForNavigation();
  console.log('Ya he esperado')

  const elementos = await page.$$('li[data-cy="listing-item"]');
  resulta=[]


  for (let i=0; i<7; i++) {
    const elemento = elementos[i]
    const titulo = await elemento.$eval('meta[itemprop="name"]', el => el.getAttribute('content'));
    const autor = await elemento.$eval('meta[itemprop="author"]', el => el.getAttribute('content'));
    const isbn = await elemento.$eval('meta[itemprop="isbn"]', el => el.getAttribute('content'));
    const editorial = await elemento.$eval('meta[itemprop="publisher"]', el => el.getAttribute('content'));
    
    //ciertos libros no tienen fecha por algun motivo
    let fechaPublicacion='';
    try{fechaPublicacion = await elemento.$eval('meta[itemprop="datePublished"]', el => el.getAttribute('content'));}
    catch (error) {
      console.log('Ha habido un error capturando la fecha de salida')
      console.log('El error concreto es el siguiente: ' + error)
      fechaPublicacion='Desconocida'
    }
    
    const precio = await elemento.$eval('meta[itemprop="price"]', el => el.getAttribute('content'));
    const precioMoneda = await elemento.$eval('meta[itemprop="priceCurrency"]', el => el.getAttribute('content'));

    //TODO imagen
    //const imagen=...............

    //if(i==2){await sleep(10000)}

    console.log('Iteración numero: ' + i)
    let texto={titulo, autor, isbn, editorial, fechaPublicacion, precio, precioMoneda}
    resulta.push(texto)
  }
    // Close browser
    await browser.close();
  // Poner los precios en JSON en un archivo
  const datosString = JSON.stringify(resulta);
  console.log(datosString)
  res.json(datosString)
  
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
