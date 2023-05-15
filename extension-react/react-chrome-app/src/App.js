import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";


function App() {
  const [searchResults, setSearchResults] = useState([]);
  const imageUrl = 'http://localhost:3001/percy-jackson';
  const [data, setData] = useState([]);
  let inicializated = false;

  const fetchObject = () => fetch(imageUrl)
  .then(response => response.json())
  .then(papa => setData(JSON.parse(papa)))
  .catch(error => console.error('Error:', error));

  //


  const handleSearch = (searchTerm) => {
    // Aquí puedes realizar la lógica de búsqueda según tus necesidades
    // Por ejemplo, puedes hacer una solicitud a una API o buscar en una lista de elementos
    // En este ejemplo, simplemente estableceremos los resultados de búsqueda en un array vacío
    fetchObject();
  };

  const performSearch = (searchTerm) => {
    // Simulamos la búsqueda con un objeto de resultados
    // Asegúrate de ajustar esta lógica según tus necesidades reales
    const fakeResults = [
      {
        titulo: 'Libro 1',
        autor: 'Autor 1',
        isbn: 'ISBN 1',
        editorial: 'Editorial 1',
        fechaPublicacion: 'Fecha 1',
        precio: 10,
        precioMoneda: 'USD'
      },
      {
        titulo: 'Libro 2',
        autor: 'Autor 2',
        isbn: 'ISBN 2',
        editorial: 'Editorial 2',
        fechaPublicacion: 'Fecha 2',
        precio: 20,
        precioMoneda: 'USD'
      }
    ];

    return fakeResults;
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {/* Aquí puedes mostrar los resultados de búsqueda */}
      <ul class="results-list">
        {data.map((result, index) => (
          <li key={index}>
            <div class="book-item">
              <div class="book-container-portada">
                <img class="book-image" src={result.imagen || '/portadaEjemplo.jpg'} alt="Imagen del libro" />
              </div>
              <div class="book-container-info">
                <div class="title">Titulo: <span>{result.titulo}</span></div>
                <div class="author">Autor: <span>{result.autor}</span></div>
                <div class="isbn">ISBN: <span>{result.isbn}</span></div>
                <div class="publisher">Editorial: <span>{result.editorial}</span></div>
                <div class="publication-date">Fecha de Publicación: <span>{result.fechaPublicacion}</span></div>
                <div class="price">Precio: <span>{result.precio} {result.precioMoneda}</span></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  
  );
}

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleInputChange} />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};


function GOOGLR(){
  const imageUrl = 'http://localhost:3001';
  const [data, setData] = useState([]);
  let inicializated = false;

  const fetchObject = () => fetch(imageUrl)
  .then(response => response.json())
  .then(papa => setData(papa))
  .catch(error => console.error('Error:', error));

  useEffect(() => {
    if (!inicializated){
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
