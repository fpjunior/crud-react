import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TelaPrincipal from '../components/pages/TelaPrincipal';
import Cadastro from '../components/pages/Cadastro';
import TabelaDespesas from '../components/pages/TabelaDespesas';
import Footer from '../components/template/Footer';
import Logo from '../components/template/Logo';
import SideBar from '../components/template/SideBar';
import './App.css'; // Importe um arquivo CSS para estilização
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function App() {

  const [showModal, setShowModal] = useState(false);
  // const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Router>
        <Logo />
        <div className="">
          <SideBar></SideBar>
          <main>
            <Footer />
            <Routes>
              {/* <Route path="/"element={<Cadastro fetchDespesas={fetchDespesas} />} />
            <Route path="/cadastro/:id" element={<Cadastro fetchDespesas={fetchDespesas} />} />
            <Route path="/cadastro" element={<Cadastro fetchDespesas={fetchDespesas} />} />
            <Route path="/tabelaDespesas" element={<TabelaDespesas fetchDespesas={fetchDespesas} />} /> */}
            </Routes>
          </main>
          <Cadastro openModal={showModal} closeModal={handleClose} />
          <TabelaDespesas openEdit={showModal} />
        </div>
      </Router>
    </>
  );
}

export default App;
