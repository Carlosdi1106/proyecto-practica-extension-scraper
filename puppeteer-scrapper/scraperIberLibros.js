const puppeteer = require('puppeteer');
const fs = require('fs');
const { Console } = require('console');

(async (stringDeBusqueda) => {

  // Lanzar el navegador y abrir la página
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.iberlibro.com/');

  //confirmar que eres humano
  /*const cajaConfirmacion= await page.$('#challenge-stage > div > label > input[type=checkbox]');
  page.click(cajaConfirmacion)*/


  //busca la palabra deseada
  const searchBox =await page.$('#header-searchbox-input-m')
  
  //await searchBox.type(stringDeBusqueda)
  await searchBox.type('star wars')
  
  await searchBox.press('Enter')
  await page.waitForNavigation();

  const elementos = await page.$$('li[data-cy="listing-item"]');
  resulta=[]


  for (let i=0; i<7; i++) {
    const elemento=elementos[i]
    const titulo = await elemento.$eval('meta[itemprop="name"]', el => el.getAttribute('content'));
    
    
    //ciertos libros no tienen fecha por algun motivo
    let fechaPublicacion='';
    try{fechaPublicacion = await elemento.$eval('meta[itemprop="datePublished"]', el => el.getAttribute('content'));}
    catch (error) {
      console.log('Ha habido un error capturando la fecha de salida')
      console.log('El error concreto es el siguiente: ' + error)
      fechaPublicacion='Desconocida'
    }

    //algunos no tienen isbn
    let isbn='';
    try{isbn = await elemento.$eval('meta[itemprop="isbn"]', el => el.getAttribute('content'));}
    catch (error) {
      console.log('Ha habido un error capturando el isbn')
      console.log('El error concreto es el siguiente: ' + error)
      isbn='Desconocida'
    }

    //alguno no tienen autor
    let autor='';
    try{autor = await elemento.$eval('meta[itemprop="author"]', el => el.getAttribute('content'));}
    catch (error) {
      console.log('Ha habido un error capturando el autor')
      console.log('El error concreto es el siguiente: ' + error)
      autor='Desconocida'
    }

    //alguno no tiene editorial
    let editorial='';
    try{editorial = await elemento.$eval('meta[itemprop="publisher"]', el => el.getAttribute('content'));}
    catch (error) {
      console.log('Ha habido un error capturando la editorial')
      console.log('El error concreto es el siguiente: ' + error)
      editorial='Desconocida'
    }
    
    const precio = await elemento.$eval('meta[itemprop="price"]', el => el.getAttribute('content'));
    const precioMoneda = await elemento.$eval('meta[itemprop="priceCurrency"]', el => el.getAttribute('content'));

    //TODO imagen
    const imagen='ejemplo.jpg'

    //if(i==2){await sleep(10000)}

    console.log('Iteración numero: ' + i)
    let texto={titulo, autor, isbn, editorial,
       fechaPublicacion, precio, precioMoneda, imagen}
    resulta.push(texto)
  }

  // Poner los precios en JSON en un archivo
  const datosString = JSON.stringify(resulta);
  console.log(datosString)
  fs.writeFileSync('scraperIberLibros.json', datosString);

  // Close browser
  await browser.close();
})();

function sleep (ms){

  return new Promise(resolve => setTimeout(resolve,ms))

}

