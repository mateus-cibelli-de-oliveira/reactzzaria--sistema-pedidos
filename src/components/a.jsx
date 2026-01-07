import { useState } from "react";

const A = ({ onControlledError }) => {
//   ERRO proposital
//   const teste = undefined;
//   console.log(teste.nome);

  const [products, setProducts] = useState([]);

  const handleClick = (e) => {
    e.preventDefault();

    try {
      const result = ["Produto 1", "Produto 2"];
      setProducts(result);
    } catch (err) {
      if (typeof onControlledError === "function") {
        onControlledError(true);
      }
      
      return; // Evita o ErrorBoundary
    }
  }

  return (
    <div className="card">
      <a className="read-the-docs" href="https://reactjs.org" onClick={handleClick}>
        Buscar produtos
      </a>

      {products.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

export default A;