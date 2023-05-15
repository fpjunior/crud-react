import React, { useState, useEffect } from 'react';
import db from '../../database';
import DeleteButton from '../template/DeleteButton';
import EditButton from '../template/EditButton';
import './TabelaDespesas.css';
import { Link } from 'react-router-dom';
import { Table, Pagination } from 'react-bootstrap';

function TabelaDespesas() {
  const [despesas, setDespesas] = useState([]);
  const [despesaEditando, setDespesaEditando] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [despesasPerPage] = useState(10);
  const [filtroData, setFiltroData] = useState(null);

  useEffect(() => {
    fetchDespesas();
  }, []);

  function fetchDespesas() {
    db.expenses.toArray().then((dados) => {
      setDespesas(dados);
    });
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta despesa?");
    if (confirmDelete) {
      db.expenses.delete(id).then(() => {
        fetchDespesas();
      });
    }
  }

  function handleEdit(despesa) {
    setDespesaEditando(despesa);
  }

  function handleFiltroDia() {
    setFiltroData(new Date().toLocaleDateString());
    let despesasFiltradas = despesas;
    if (filtroData) {
      despesasFiltradas = despesas.filter((despesa) => despesa.date === filtroData);
    }
  
  }

 
  // Get current despesas
  const indexOfLastDespesa = currentPage * despesasPerPage;
  const indexOfFirstDespesa = indexOfLastDespesa - despesasPerPage;
  const currentDespesas = despesas.slice(indexOfFirstDespesa, indexOfLastDespesa);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(despesas.length / despesasPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className='btn-cadastro'>
        <Link to="/cadastro">
          <button className="btn-salvar"  type="submit">+ Nova Despesa</button>
        </Link>
        <button onClick={handleFiltroDia}>Filtrar por dia</button>
      </div>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Tipo de Pagamento</th>
            <th>Data</th>
            <th>Operações</th>
          </tr>
        </thead>
        <tbody>
          {currentDespesas.map((despesa) => (
            <tr key={despesa.id}>
              <td>{despesa.descricao}</td>
              <td>{despesa.tipo}</td>
              <td>R$ {despesa.valor}</td>
              <td>{despesa.typePayment}</td>
              <td>{despesa.date}</td>
              <td>
                <DeleteButton onClick={() => handleDelete(despesa.id)} />
                <EditButton id={`${despesa.id}`} onClick={() => handleEdit(despesa)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {pageNumbers.map(number => (
          <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
            {number}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
}

export default TabelaDespesas;
