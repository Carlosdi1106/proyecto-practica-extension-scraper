const puppeteer = require('puppeteer');
const fs = require('fs');

async function busquedaAmazon(stringDeBusqueda){
  // Lanzar el navegador y abrir la página
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const page2 = await browser.newPage();
  await page.goto('https://www.amazon.es');

  // Bucar la caja de busqueda e introducir el texto en ella
  const searchBox = await page.$('#twotabsearchtextbox');
  let busqueda = stringDeBusqueda + ' libros'
  //let busqueda= 'Percy Jackson libro español';
  try{
    await searchBox.type(busqueda);
  }
  catch (error)
  {
    throw new Error('Vuelve a lanzar el scraper. Ha dado error en el type')
  }


  // Apretar el boton enter
  await searchBox.press('Enter');
  await page.waitForNavigation();
  await page.addScriptTag({ content: 'document.charset = "UTF-8";' });

  //await sleep(1000000000);
  
  
  //BORRAR UNA VEZ PASE CON PARAMETRO
  //busqueda=stringDeBusqueda


  // Extraer datos
  const products = await page.evaluate((busquedaParam) => {
    let results = [];
    let j=0;
    const items = document.querySelectorAll(".s-result-item .s-card-border");
    for (let i = items.length; i--; ) {

      

      let item = items[i];
      let titulo = item.querySelector("h2 > a > span");
      let precio = item.querySelector(".a-price-whole");
      let imagen = item.querySelector("img");
      let autor = item.querySelector("a[class='a-size-base a-link-normal s-underline-text s-underline-link-text s-link-style']");
      
      
      let isbn = 'xxxxxxxxxxxxxxxxxxxxxxxx';
      let editorial = 'xxxxxxxxxxxxxxxxxxxxxxxxxx';
      let fechaPublicacion = 'xxxxxxxxxxxxxxxxxxxxxxxx';
      
      
      let url= item.querySelector("a[class='a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal']");
      url=url.getAttribute('href')
      url='https://www.amazon.es' + url
      let precioMoneda = 'EUR';
      //let precioMoneda = item.querySelector(".a-price-symbol"); TODO solucionar para que muestre el dinero

      //ajustar los resultados

      //Solo seleccione libros "válidos" TITULOS
      titulo= titulo.innerText;
      let tituloAux = titulo.toLowerCase()
      //TODO posible problema con el parametro
      if (!(tituloAux.includes(busquedaParam.toLowerCase())))
      {
        console.log(titulo);
        continue;
      }

      //AUTORES
      try{
        autor= autor.innerText; 
      }
      catch (error){
        continue;
      }
      
      //precioMoneda=precioMoneda.innerText; TODO solucionar para que muestre el dinero
      
      //el producto puede no tener precio
      if(precio==null){
        continue;
      } 
      else
      {
        let precioAux= precio.innerText;        
        precio=parseFloat(precioAux.replace("," , "."))
      }
      imagen= imagen.getAttribute("src");

      //poner y pushear en el array
      let texto={titulo, autor, isbn, editorial,
        fechaPublicacion, precio, precioMoneda, imagen,url};
      results.push(texto);
    }
    return results;


    
  //}, busqueda);
  }, stringDeBusqueda);

  
  // Abrir la página individual del producto
  
  for (let libro of products){
    const productPage = await browser.newPage();
    await productPage.goto(libro.url);
    const libroFinal = await productPage.evaluate(() => {
      let doc=document.getElementById('detailBullets_feature_div');
      let isbn=''
      let editorial=''
      let fechaPublicacion=''

      let isbnAux=''
      try{isbnAux=doc.querySelector('ul > li:nth-child(5) > span > span:nth-child(2)').innerText;}
      catch (error){
        console.log('Error leyendo el isbn')
        isbn='ErrorEnElIsbn'
      }
      isbn=isbnAux.replace("-","")
      if(isbn.length != 13)
      {
        isbn="Eliminar"
      }
      let fechaYeditorial=''
      try{fechaYeditorial= doc.querySelector('ul > li:nth-child(1) > span > span:nth-child(2)').innerText}
      catch (error){
        fechaYeditorial='ErrorEnElSegundoFechaEdit'
      }

      if(!(fechaYeditorial.includes('('))){
        try{fechaYeditorial= doc.querySelector('ul > li:nth-child(2) > span > span:nth-child(2)').innerText}
        catch (error){
          fechaYeditorial='ErrorEnElPrimerFechaEdit'
        }
      }

      if(!(fechaYeditorial.includes('('))){
        fechaPublicacion='Desconocida'
        editorial='Desconocida'
      }
      else{
        const regex = /\((.*?)\)/;
        let fechaPublicacionAux = fechaYeditorial.match(regex);
        fechaPublicacion=fechaPublicacionAux[1];

        let editorialAux= fechaYeditorial.split(regex)
        editorial=editorialAux[0].trim();
      }


      return {isbn,editorial, fechaPublicacion}
    });
    //console.log(libroFinal)

    libro.editorial=libroFinal.editorial
    libro.fechaPublicacion=libroFinal.fechaPublicacion
    libro.isbn=libroFinal.isbn
  }


  const productosFinales= products.filter(elemento => elemento.isbn !== "Eliminar")

  console.log(productosFinales)


  // Poner los precios en JSON en un archivo
  const datosString = JSON.stringify(productosFinales);
  

  // Close browser
  await browser.close();
  return datosString;
};




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports={busquedaAmazon};