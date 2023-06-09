import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
//import {busquedaAmazon, busquedaIberLibro} from '../background';
//import {compararLibros} from './procesamientoResultados.js';
//const compararLibros = require('./procesamientoResultados.js')

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [activeButton, setActiveButton] = useState(20);
  const [loading, setLoading] = useState(false);
  const imageUrl = "http://localhost:3001/";
  const [data, setData] = useState([]);
  let inicializated = false;

  //En un pricipio se habia utilizado importandolo de una fichero.js para que sea mas claro, pero por temas
  //de importacion de la extension chrome, se ha tenido que copiar y pegar.
  function compararLibros(listaIber, listaAmazonLibro) {
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

  const fetchObject = (busq) =>
    fetch(busq)
      .then((response) => response.json())
      .then((papa) => {
        let resu = papa;
        let resulPro = compararLibros(
          resu.busquedaIberLibros,
          resu.busquedaAmazon
        );
        console.log(resulPro);
        setData(resulPro);
        setLoading(false);
      })
      .catch((error) => console.error("Error:", error));

  //
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  
  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const handleSearch = (searchTerm) => {
    // Aquí puedes realizar la lógica de búsqueda según tus necesidades
    // Por ejemplo, puedes hacer una solicitud a una API o buscar en una lista de elementos
    // En este ejemplo, simplemente estableceremos los resultados de búsqueda en un array vacío
    setLoading(true);
    let busqueda = imageUrl + searchTerm + '/' + activeButton;
    fetchObject(busqueda);
    
    //setData(JSON.parse(busquedaIberLibro(imageUrl)));
  };

  const performSearch = (searchTerm) => {
    // Simulamos la búsqueda con un objeto de resultados
    // Asegúrate de ajustar esta lógica según tus necesidades reales
    const fakeResults = [
      {
        titulo: "Libro 1",
        autor: "Autor 1",
        isbn: "ISBN 1",
        editorial: "Editorial 1",
        fechaPublicacion: "Fecha 1",
        precio: 10,
        precioMoneda: "USD",
      },
      {
        titulo: "Libro 2",
        autor: "Autor 2",
        isbn: "ISBN 2",
        editorial: "Editorial 2",
        fechaPublicacion: "Fecha 2",
        precio: 20,
        precioMoneda: "USD",
      },
    ];

    return fakeResults;
  };

  return (
    <div>
      <ExclusiveButtons activeButton={activeButton} onButtonClick={handleButtonClick} />
      <SearchBar onSearch={handleSearch} />
      {/*
      <div>
        <h1>Idioma seleccionado: {selectedLanguage}</h1>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>
  */}
      {/* Aquí puedes mostrar los resultados de búsqueda */}
      <div>
        {loading?( 
        <div class="loading-circle"></div>
        )
        :data.length > 0 ? (
          <div className="row">
            <div
              className={`column ${
                data[currentIndex]?.mas_bajo === 1 ? "highlight" : ""
              }`}
            >
              <h2>IberLibros</h2>
              <div className="book-item">
                <div className="book-container-portada">
                  <img
                    className="book-image"
                    src={
                      data[currentIndex]?.contenidoIberLibro?.imagen ||
                      "/portadaEjemplo.jpg"
                    }
                    alt="Imagen del libro"
                  />
                </div>
                <div className="book-container-info">
                  <div className="title">
                    Titulo:{" "}
                    <span>
                      {data[currentIndex]?.contenidoIberLibro?.titulo}
                    </span>
                  </div>
                  <div className="author">
                    Autor:{" "}
                    <span>{data[currentIndex]?.contenidoIberLibro?.autor}</span>
                  </div>
                  <div className="isbn">
                    ISBN:{" "}
                    <span>{data[currentIndex]?.contenidoIberLibro?.isbn}</span>
                  </div>
                  <div className="publisher">
                    Editorial:{" "}
                    <span>
                      {data[currentIndex]?.contenidoIberLibro?.editorial}
                    </span>
                  </div>
                  <div className="publication-date">
                    Fecha de Publicación:{" "}
                    <span>
                      {data[currentIndex]?.contenidoIberLibro?.fechaPublicacion}
                    </span>
                  </div>
                  <div className="price">
                    Precio:{" "}
                    <span>
                      {data[currentIndex]?.contenidoIberLibro?.precio}{" "}
                      {data[currentIndex]?.contenidoIberLibro?.precioMoneda}
                    </span>
                  </div>
                  <div className="buy-button">
                    <a href={data[currentIndex]?.contenidoIberLibro?.url} target="_blank" rel="noopener noreferrer" className="buy-link">
                      Comprar
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`column ${
                data[currentIndex]?.mas_bajo === 2 ? "highlight" : ""
              }`}
            >
              <h2>Amazon</h2>
              <div className="book-item">
                <div className="book-container-portada">
                  <img
                    className="book-image"
                    src={
                      data[currentIndex]?.contenidoAmazon?.imagen ||
                      "/portadaEjemplo.jpg"
                    }
                    alt="Imagen del libro"
                  />
                </div>
                <div className="book-container-info">
                  <div className="title">
                    Titulo:{" "}
                    <span>{data[currentIndex]?.contenidoAmazon?.titulo}</span>
                  </div>
                  <div className="author">
                    Autor:{" "}
                    <span>{data[currentIndex]?.contenidoAmazon?.autor}</span>
                  </div>
                  <div className="isbn">
                    ISBN:{" "}
                    <span>{data[currentIndex]?.contenidoAmazon?.isbn}</span>
                  </div>
                  <div className="publisher">
                    Editorial:{" "}
                    <span>
                      {data[currentIndex]?.contenidoAmazon?.editorial}
                    </span>
                  </div>
                  <div className="publication-date">
                    Fecha de Publicación:{" "}
                    <span>
                      {data[currentIndex]?.contenidoAmazon?.fechaPublicacion}
                    </span>
                  </div>
                  <div className="price">
                    Precio:{" "}
                    <span>
                      {data[currentIndex]?.contenidoAmazon?.precio}{" "}
                      {data[currentIndex]?.contenidoAmazon?.precioMoneda}
                    </span>
                  </div>
                  <div className="buy-button">
                    <a href={data[currentIndex]?.contenidoAmazon?.url} target="_blank" rel="noopener noreferrer" className="buy-link">
                      Comprar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          null
        )}
        <div className="button-container">
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === data.length - 1}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div>
    <div className="search-container">
  {/* Input para ingresar el término de búsqueda */}
  <input
    type="text"
    value={searchTerm}
    onChange={handleInputChange}
    placeholder="Ingrese su búsqueda"
    className="search-input"
  />

  {/* Botón para iniciar la búsqueda */}
  <button onClick={handleSearch} className="search-button">
    Buscar
  </button>
</div>
<div>
  <p>#Recomendado para busquedas con ISBN o titulos precisos.</p>
</div>
</div>
  );
};


const ExclusiveButtons = ({ activeButton, onButtonClick }) => {
  return (
    <div className="button-container">
      <h1>Modo de Busqueda: </h1>
      <button
        className={`button green-button ${activeButton === 20 ? 'active' : ''}`}
        onClick={() => onButtonClick(20)}
      >
        Rapido
      </button>
      <button
        className={`button yellow-button ${activeButton === 40 ? 'active' : ''}`}
        onClick={() => onButtonClick(40)}
      >
        Normal
      </button>
      <button
        className={`button red-button ${activeButton === 60 ? 'active' : ''}`}
        onClick={() => onButtonClick(60)}
      >
        Lento
      </button>
    </div>
  );
};

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    onLanguageChange(newLanguage);
  };

  return (
    <div>
      <label htmlFor="language-select">Selecciona el idioma: </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={handleLanguageChange}
      >
        <option value="English">Inglés</option>
        <option value="Español">Español</option>
        <option value="Euskara">Euskara</option>
        {/* Agrega más opciones de idioma según sea necesario */}
      </select>
    </div>
  );
};

function GOOGLR() {
  const imageUrl = "http://localhost:3001";
  const [data, setData] = useState([]);
  let inicializated = false;

  const fetchObject = () =>
    fetch(imageUrl)
      .then((response) => response.json())
      .then((papa) => setData(papa))
      .catch((error) => console.error("Error:", error));

  useEffect(() => {
    if (!inicializated) {
      inicializated = true;
      fetchObject();
    }
  }, []);

  return (
    <div>
      Aqui : <p>{data}</p>
    </div>
  );
}

export default App;
