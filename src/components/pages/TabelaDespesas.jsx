import React, { useState, useEffect } from 'react';
import db from '../../database';
import DeleteButton from '../template/DeleteButton';
import EditButton from '../template/EditButton';
import './TabelaDespesas.css';
import { Link } from 'react-router-dom';
import { Table, Pagination } from 'react-bootstrap';
import { format } from 'date-fns';
import PillExample from '../template/Badge';


function TabelaDespesas() {
  const [despesas, setDespesas] = useState([]);
  const [despesaEditando, setDespesaEditando] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [despesasPerPage] = useState(10);
  const [filtroData, setFiltroData] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  // Get current despesas
  const indexOfLastDespesa = currentPage * despesasPerPage;
  const indexOfFirstDespesa = indexOfLastDespesa - despesasPerPage;
  const currentDespesas = despesas.slice(indexOfFirstDespesa, indexOfLastDespesa);


  useEffect(() => {
    fetchDespesas();
  }, []);

  function fetchDespesas() {
    db.expenses.toArray().then((dados) => {
      setDespesas(dados);
    });
  }
  let despesasExibidas = filtroData ? despesas : currentDespesas;
  const totalRegistros = despesasExibidas.length;


  function handleFiltroDia(event) {
    setFiltroData(new Date().toLocaleDateString('pt-BR'));
    setFiltroAtivo(true); // Altere o estado de filtroAtivo
    if (event === 'Todos') {
      setFiltroData(null); // Remova o filtro
      setFiltroAtivo(false);
    }
  }

  function removeFiltro() {
    setFiltroData(null); // Remova o filtro
    setFiltroAtivo(false);
  }

  if (filtroData) {
    despesasExibidas = despesas.filter((despesa) => despesa.date === filtroData);
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

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber < 1) {
      pageNumber = 1; // Limita a página mínima como 1
    } else if (pageNumber > pageNumbers.length) {
      pageNumber = pageNumbers.length; // Limita a página máxima como o número total de páginas
    }
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(despesas.length / despesasPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className='btn-cadastro'>
        <Link to="/cadastro">
          <button className="btn-salvar btn-outline-primary" type="submit">+ Nova Despesa</button>
        </Link>
        <PillExample onClick={(event) => handleFiltroDia(event)}></PillExample>
      </div>
      <Table striped bordered hover responsive>
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
          {despesasExibidas.map((despesa) => (
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
        <tfoot>
          <tr>
            <td colSpan="6">Total de registros: {totalRegistros}</td>
          </tr>
        </tfoot>
      </Table>

      <Pagination>
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
        {pageNumbers.map(number => (
          <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => paginate(currentPage + 1)} />
      </Pagination>

    </div>
  );
}

export default TabelaDespesas;
