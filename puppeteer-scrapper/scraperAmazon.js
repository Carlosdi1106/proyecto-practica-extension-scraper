const puppeteer = require('puppeteer');
const fs = require('fs');

(async (stringDeBusqueda) => {
  // Lanzar el navegador y abrir la página
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.amazon.es');

  // Bucar la caja de busqueda e introducir el texto en ella
  const searchBox = await page.$('#twotabsearchtextbox');
  //let busqueda = stringDeBusqueda + ' libros'
  let busqueda= 'percy jackson libros';
  await searchBox.type(busqueda);
  
  // Apretar el boton enter
  await searchBox.press('Enter');
  await page.waitForNavigation();
  await page.addScriptTag({ content: 'document.charset = "UTF-8";' });

  //await sleep(1000000000);
  //BORRAR UNA VEZ PASE CON PARAMETRO
  busqueda='percy jackson'


  // Extraer datos
  const products = await page.evaluate((busquedaParam) => {
    let results = [];
    const items = document.querySelectorAll(".s-result-item .s-card-border");
    for (let i = items.length; i--; ) {
      let item = items[i];
      let titulo = item.querySelector("h2 > a > span");
      let precio = item.querySelector(".a-price-whole");
      let imagen = item.querySelector("img");
      let autor = item.querySelector("a[class='a-size-base a-link-normal s-underline-text s-underline-link-text s-link-style']");
      let isbn = '1234567890';
      let editorial = 'EditorialEjemplo';
      let fechaPublicacion = '33333333';
      let url= item.querySelector("a[class='a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal']");
      url=url.getAttribute('href')
      url='amazon.es' + url
      let precioMoneda = 'EUR';
      //let precioMoneda = item.querySelector(".a-price-symbol"); TODO solucionar para que muestre el dinero

      //ajustar los resultados

      //Solo seleccione libros "válidos" TITULOS
      titulo= titulo.innerText;
      let tituloAux = titulo.toLowerCase()
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
  }, busqueda);
  

  console.log(products)

  // Poner los precios en JSON en un archivo
  const datosString = JSON.stringify(products);
  fs.writeFileSync('scraperAmazon.json', datosString);

  // Close browser
  await browser.close();
})();


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}