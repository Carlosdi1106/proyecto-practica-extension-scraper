const puppeteer = require('puppeteer');
const fs = require('fs');
const { Console } = require('console');

async function busquedaIberLibro(stringDeBusqueda){

  // Lanzar el navegador y abrir la página
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.iberlibro.com/');

  //busca la palabra deseada
  const searchBox =await page.$('#header-searchbox-input-m')
  
  //await searchBox.type(stringDeBusqueda)
  await searchBox.type('percy jackson libro español')
  
  await searchBox.press('Enter')
  await page.waitForNavigation();

  const elementos = await page.$$('li[data-cy="listing-item"]');
  resulta=[]

  

  for (let i=0; i<30; i++) {
    const elemento=elementos[i]
    
    try{titulo = await elemento.$eval('meta[itemprop="name"]', el => el.getAttribute('content'));}
    catch (error) {
      console.log('Ha habido un error capturando el titulo')
      console.log('El error concreto es el siguiente: ' + error)
      continue;
    }
    
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
      continue;
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

    //imagen
    let imagen='';
    try{imagen = await elemento.$eval('img[class="srp-item-image"]', el => el.getAttribute('src'));}
    catch (error) {
      console.log('Ha habido un error capturando la imagen')
      console.log('El error concreto es el siguiente: ' + error)
      imagen=null;
    }

    //url
    let url= await elemento.$eval('a[class="srp-image-link thumbnail"]', el => el.getAttribute('href'));
    url = 'https://www.iberlibro.com'+url

    //if(i==2){await sleep(10000)}

    console.log('Iteración numero: ' + i)
    let texto={titulo, autor, isbn, editorial,
       fechaPublicacion, precio, precioMoneda, imagen,url}
    resulta.push(texto)
  }

  // Poner los precios en JSON en un archivo
  const datosString = JSON.stringify(resulta);
  console.log(datosString)
  

  // Close browser
  await browser.close();
  return datosString;
};

module.exports={busquedaIberLibro};
