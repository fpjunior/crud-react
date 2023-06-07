import { BrowserRouter as Router, Routes } from 'react-router-dom';
import Cadastro from '../components/pages/Cadastro';
import TabelaDespesas from '../components/pages/TabelaDespesas';
import Footer from '../components/template/Footer';
import Logo from '../components/template/Logo';
import SideBar from '../components/template/SideBar';
import './App.css'; // Importe um arquivo CSS para estilização
import React, { useState } from 'react';
import MyNavbar from '../components/template/Navbar';
import DataFile from '../components/pages/DataFile';
import db from '../../src/database';

function App() {

  const [despesas, setDespesas] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModalDataFile, setShowModalDataFile] = useState(false);
  const handleClose = () => setShowModal(false);

  const fetchDespesas = () => {
    function fetchDespesas() {
      db.expenses.toArray().then((dados) => {
        dados.sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split("/");
          const [dayB, monthB, yearB] = b.date.split("/");
          return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
        });
        setDespesas(dados);
        // calcularSomaDespesas(dados);
      });
    }
    // Sua lógica para buscar as despesas
  };
  
  const handleCloseBackup = () => {
    setShowModalDataFile(false);
    // atualizarTabela();
  } 


  function abrirDataFile() {
    setShowModalDataFile(true);
  }

  return (
    <>
      <Router>
        <Logo />
          <SideBar></SideBar>
        <div className="div-principal">
          <main>
            <Footer />
            <Routes>
              {/* <Route path="/"element={<Cadastro fetchDespesas={fetchDespesas} />} />
            <Route path="/cadastro/:id" element={<Cadastro fetchDespesas={fetchDespesas} />} />
            <Route path="/cadastro" element={<Cadastro fetchDespesas={fetchDespesas} />} />
            <Route path="/tabelaDespesas" element={<TabelaDespesas fetchDespesas={fetchDespesas} />} /> */}
            </Routes>
          </main>
          {/* <Cadastro openModal={showModal} closeModal={handleClose} /> */}
          <TabelaDespesas fetchDespesas={fetchDespesas} atualizarTabela={handleCloseBackup} openEdit={showModal} />
          <DataFile atualizarTabela={handleCloseBackup} openModal2={showModalDataFile} closeModal={handleCloseBackup} />

        </div>
          <MyNavbar onClick={abrirDataFile} className="my-navbar"/>
      </Router>
    </>
  );
}

export default App;
