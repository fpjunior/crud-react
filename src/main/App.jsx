import { BrowserRouter as Router, Routes } from 'react-router-dom';
import Cadastro from '../components/pages/Cadastro';
import TabelaDespesas from '../components/pages/TabelaDespesas';
import Footer from '../components/template/Footer';
import Logo from '../components/template/Logo';
import SideBar from '../components/template/SideBar';
import './App.css'; // Importe um arquivo CSS para estilização
import React, { useState } from 'react';
import MyNavbar from '../components/template/Navbar';

function App() {

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

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
          <TabelaDespesas openEdit={showModal} />
        </div>
          <MyNavbar className="my-navbar"/>
      </Router>
    </>
  );
}

export default App;
