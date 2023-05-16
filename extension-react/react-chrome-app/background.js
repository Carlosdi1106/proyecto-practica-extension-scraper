const puppeteer = require('puppeteer');

async function busquedaAmazon(stringDeBusqueda) {
  // Lanzar el navegador y abrir la página
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const page2 = await browser.newPage();
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
    let j=0;
    const items = document.querySelectorAll(".s-result-item .s-card-border");
    for (let i = items.length; i--; ) {

      if(j>10){continue}
      j++;


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


    
  }, busqueda);
  
  // Abrir la página individual del producto
  
  for (let libro of products){
    const productPage = await browser.newPage();
    await productPage.goto(libro.url);
    const libroFinal = await productPage.evaluate(() => {
      let doc=document.getElementById('detailBullets_feature_div');
      
      let isbnAux=doc.querySelector('ul > li:nth-child(5) > span > span:nth-child(2)').innerText
      let isbn=isbnAux.replace("-","")
      if(isbn.length != 13)
      {
        isbn="Eliminar"
      }
      
      let fechaYeditorial= doc.querySelector('ul > li:nth-child(1) > span > span:nth-child(2)').innerText

      if(!(fechaYeditorial.includes('('))){
        fechaYeditorial= doc.querySelector('ul > li:nth-child(2) > span > span:nth-child(2)').innerText
      }

      const regex = /\((.*?)\)/;
      let fechaPublicacionAux = fechaYeditorial.match(regex);
      const fechaPublicacion=fechaPublicacionAux[1];

      let editorialAux= fechaYeditorial.split(regex)
      const editorial=editorialAux[0].trim();

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
  return datosString;

  // Close browser
  await browser.close();
};

async function busquedaIberLibros(stringDeBusqueda){

    // Lanzar el navegador y abrir la página
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.iberlibro.com/');
  
    //busca la palabra deseada
    const searchBox =await page.$('#header-searchbox-input-m')
    
    //await searchBox.type(stringDeBusqueda)
    await searchBox.type('farenheit 451')
    
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
    fs.writeFileSync('scraperIberLibros.json', datosString);
    
  
    // Close browser
    await browser.close();
  };

  module.exports=busquedaAmazon,busquedaIberLibros;
