import React from "react";

function Results({results}){
  if(!results || results.length===0) return <p className="no-results">Aucun résultat trouvé.</p>

  return (
    <div className="results-container">
      {results.map((r,i)=>(
        <div key={i} className="result-card">
          <h3 className="result-name">{r.name}</h3>
          {r.address && <p className="result-info">{r.address}</p>}
          {r.phone && <p className="result-info result-phone">{r.phone}</p>}
          {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer" className="result-link">Visiter le site web →</a>}
          {r.image && <img src={r.image} alt={r.name} className="result-image" width="300"/>}
        </div>
      ))}
    </div>
  )
}

export default Results;
