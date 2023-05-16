import React, { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './SideBar.css';

function SideBar() {
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleClick = () => {
    setShowSidebar(false);
  };

  return (
    <div>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </div>
      <aside className={`sidebar ${showSidebar ? 'active' : ''}`} ref={sidebarRef}>
        <nav>
          <ul>
            <li>
              <Link to="/" onClick={handleClick}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/cadastro" onClick={handleClick}>
                Cadastro
              </Link>
            </li>
            <li>
              <Link to="/tabelaDespesas" onClick={handleClick}>
                Tabela
              </Link>
            </li>
            <li>
              <a href="/sobre" onClick={handleClick}>
                Sobre
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default SideBar;
