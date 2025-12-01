import React, { useState } from "react";
import axios from "axios";
import Results from "./components/Results";
import Pagination from "./components/Pagination";
import "./App.css";

function App() {
  const [term, setTerm] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const fetchResults = async (page=1) => {
    try{
      const res = await axios.get("http://localhost/business_api/api.php", {
        params:{ term, location, page }
      });
      setResults(res.data.businesses || []);
      setTotalResults(res.data.total || res.data.businesses.length);
    }catch(err){
      alert("Erreur API");
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchResults(1);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchResults(page);
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Recherche d'entreprises locales</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input 
            className="search-input"
            placeholder="Mot-clé" 
            value={term} 
            onChange={e=>setTerm(e.target.value)}
          />
          <input 
            className="search-input"
            placeholder="Localisation" 
            value={location} 
            onChange={e=>setLocation(e.target.value)}
          />
          <button type="submit" className="search-button">Rechercher</button>
        </form>

        <Results results={results} />
        <Pagination
          currentPage={currentPage}
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default App;
