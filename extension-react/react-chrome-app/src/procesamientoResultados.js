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
    },
    // ...
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
    },
    // ...
  ];
  
  
function compararLibros(listaIber, listaAmazonLibro){
    const resultados = [];
  for (let libroIberLibro of listaIber) {
    for (let libroAmazon of listaAmazonLibro) {
      if (libroIberLibro.isbn === libroAmazon.isbn) {
        const resultado = {};
        if (libroIberLibro.precio < libroAmazon.precio) {
          resultado.mas_bajo = 1;
        } else if (libroIberLibro.precio > libroAmazon.precio) {
          resultado.mas_bajo = 2;
        } else {
          resultado.mas_bajo = "Igual";
        }
        
        resultado.contenidoIberLibro = libroIberLibro;
        resultado.contenidoAmazon = libroAmazon;
  
        resultados.push(resultado);
      }
    }
  }
  return resultados;
}
  
  let resul= compararLibros(listaIberLibro,listaAmazon);
  console.log(resul);
  