import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TelaPrincipal from '../components/pages/TelaPrincipal';
import Cadastro from '../components/pages/Cadastro';
import TabelaDespesas from '../components/pages/TabelaDespesas';
import Footer from '../components/template/Footer';
import Logo from '../components/template/Logo';
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const fetchDespesas = () => {
    // lógica para buscar as despesas no banco de dados
  }

  return (
    <Router>
       <Logo />
      <Routes>
        <Route path="/" element={<TelaPrincipal />} />
        <Route path="/cadastro/:id" element={<Cadastro fetchDespesas={fetchDespesas} />} />
        <Route path="/cadastro" element={<Cadastro fetchDespesas={fetchDespesas} />} />
        <Route path="/tabelaDespesas" element={<TabelaDespesas fetchDespesas={fetchDespesas} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
