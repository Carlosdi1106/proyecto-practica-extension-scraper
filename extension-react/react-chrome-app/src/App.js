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
      <ul>
        {data.map((result, index) => (
          <li key={index}>
            <div>Titulo: {result.titulo}</div>
            <div>Autor: {result.autor}</div>
            <div>ISBN: {result.isbn}</div>
            <div>Editorial: {result.editorial}</div>
            <div>Fecha de Publicación: {result.fechaPublicacion}</div>
            <div>Precio: {result.precio} {result.precioMoneda}</div>
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
