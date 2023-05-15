import { Navbar, Button, Nav } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa'; // Importe o ícone do menu hamburguer
import React, { useState } from 'react';
import './SideBar.css';
import { Link } from 'react-router-dom';


function SideBar() {

    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
    return (
        <div>
            {/* Botão do menu hamburguer */}
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars />
            </div>
            {/* Sidebar */}
            <aside className={`sidebar ${showSidebar ? 'active' : ''}`}>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/cadastro">Cadastro</Link>
                        </li>
                        <li>
                            <Link to="/tabelaDespesas">Tabela</Link>
                        </li>
                        <li>
                            <a href="/sobre">sobre</a>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
}

export default SideBar;
