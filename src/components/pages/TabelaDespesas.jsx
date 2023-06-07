import React, { useState, useEffect } from 'react';
import db from '../../database';
import DeleteButton from '../template/DeleteButton';
import EditButton from '../template/EditButton';
import MyCard from '../template/Card';
import './TabelaDespesas.css';
import { Link } from 'react-router-dom';
import { Table, Pagination } from 'react-bootstrap';
import { format } from 'date-fns';
import PillExample from '../template/Badge';
import moment from 'moment';
import Cadastro from './Cadastro';
import { Form, Button } from 'react-bootstrap';
import { TfiArrowDown } from "react-icons/tfi";
import { TfiArrowUp } from "react-icons/tfi";
import DataFile from '../pages/DataFile';

function TabelaDespesas({ openEdit, atualizarTabela }) {
  const [despesas, setDespesas] = useState([]);
  const [despesaEditando, setDespesaEditando] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [despesasPerPage] = useState(10);
  const [idEdit, setIdEdit] = useState(null);
  const [filtroData, setFiltroData] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState(false);

  const [somaDespesas, setSomaDespesas] = useState(0);
  const [somaReceitas, setSomaReceitas] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleCloseBackup = () => setShowModal2(false);
  const handleShow = () => setShowModal(true);

  // Get current despesas
  const indexOfLastDespesa = currentPage * despesasPerPage;
  const indexOfFirstDespesa = indexOfLastDespesa - despesasPerPage;
  let currentDespesas = despesas.slice(indexOfFirstDespesa, indexOfLastDespesa);

  useEffect(() => {
    fetchDespesas();
  }, []);

  async function fetchDespesas() {
    try {
      const dados = await db.expenses.toArray();
      dados.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split("/");
        const [dayB, monthB, yearB] = b.date.split("/");
        return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
      });

      setDespesas(dados);

    } catch (err) {

    }
  }

  function returnValueMonetary(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  async function calcularSomaDespesas(despesasParams) {
    try {
      const despesas = await db.expenses.toArray();
      let somaDespesas = 0;
      let somaReceitas = 0;
      despesasParams.forEach((despesa) => {
        const numero = parseFloat(despesa.valor.replace(',', '.'));
        if (despesa.tipo === 'despesa') {
          somaDespesas += numero;
        }
        if (despesa.tipo === 'receita') {
          somaReceitas += numero;
        }
      });
  
      setSomaReceitas(returnValueMonetary(somaReceitas));
      setSomaDespesas(returnValueMonetary(somaDespesas));
    } catch (error) {
      // Trate o erro aqui
    }
  }

  function handleFiltroDia(event) {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    setFiltroData(new Date().toLocaleDateString('pt-BR'));
    setFiltroAtivo(true); // Altere o estado de filtroAtivo
    switch (event) {
      case 'Todos':
        setFiltroData(null); // Remova o filtro
        setFiltroAtivo(false);
        calcularSomaDespesas(despesas);
        break;
      case 'Diariamente':
        setFiltroData(null);  // Defina o estado de filtroDiaAtual como true
        setFiltroData(moment().format('DD/MM/YYYY'));
        break;
      case 'Semanal':
        setFiltroData(`${firstDayOfWeek.toLocaleDateString('pt-BR')} - ${lastDayOfWeek.toLocaleDateString('pt-BR')}`);
        setFiltroAtivo(true);
        break;
      case 'Mensal':
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        setFiltroData(`${firstDayOfMonth.toLocaleDateString('pt-BR')} - ${lastDayOfMonth.toLocaleDateString('pt-BR')}`);
        setFiltroAtivo(true);
        break;

      default:
        break;
    }
  }

  if (filtroData) {
    let startDate, endDate;

    if (filtroData.includes('-')) {
      [startDate, endDate] = filtroData.split(' - ');
    } else {
      startDate = endDate = filtroData;
    }

    const startMoment = moment(startDate, 'DD/MM/YYYY');
    const endMoment = moment(endDate, 'DD/MM/YYYY');

    currentDespesas = despesas.filter((despesa) => {
      const despesaDate = moment(despesa.date, 'DD/MM/YYYY');
      return despesaDate.isBetween(startMoment, endMoment, null, '[]');
    });

    if (currentPage === 1) {
      calcularSomaDespesas(currentDespesas);
    }
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
    setShowModal(true);
    setIdEdit(despesa.id);
  }

  function novoRegistro(despesa) {
    setDespesaEditando(null);
    setShowModal(true);
    setIdEdit(null);
  }

  function backup() {
    fetchDespesas()
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

  function getTotalRegistros() {
    if (filtroData === '') {
      calcularSomaDespesas(currentDespesas);
    }
    return filtroData ? currentDespesas.length : despesas.length;
  }

  const getValorClass = (tipo) => {
    if (tipo === 'receita') {
      return 'style-receita';
    } else if (tipo === 'despesa') {
      return 'style-despesa';
    }
    return '';
  }

  function renderIcon(iconType) {
    if (iconType === 'despesa') {
      return <TfiArrowUp size={24} />

    }
    if (iconType === 'receita') {
      return <TfiArrowDown size={24} />
    }
  }

  return (
    <div>

      {/* <DataFile openModal2={showModal2} closeModal={handleCloseBackup} atualizarTabela={fetchDespesas} /> */}
      <Cadastro idEdit={idEdit} openModal={showModal} closeModal={handleClose} atualizarTabela={fetchDespesas} />

      <div className="div-nova-despesa">
        <Button className='new-record' variant="primary" onClick={novoRegistro}>
          + Nova Despesa/Receita
        </Button>
        <Button variant="primary" onClick={backup}>
          Atualizar Tabela
        </Button>
      </div>
      <div className='btn-cadastro'>
        <PillExample onClick={(event) => handleFiltroDia(event)}></PillExample>
      </div>
      <div className='div-cards'>
        <MyCard icon={renderIcon('despesa')} title="Total Saída" content={somaDespesas}></MyCard>
        <MyCard icon={renderIcon('receita')} title="Total Entrada" content={somaReceitas}> </MyCard>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Origem</th>
            <th>Data</th>
            <th>Operações</th>
          </tr>
        </thead>
        <tbody>
          {currentDespesas.map((despesa) => (
            <tr key={despesa.id}>
              <td className={getValorClass(despesa.tipo)}>{despesa.descricao}</td>
              <td className={getValorClass(despesa.tipo)}>{despesa.tipo}</td>
              <td className={getValorClass(despesa.tipo)}>{despesa.valor}</td>
              <td className={getValorClass(despesa.tipo)}>{despesa.typePayment}</td>
              <td className={getValorClass(despesa.tipo)}>{despesa.date}</td>
              <td>
                <DeleteButton onClick={() => handleDelete(despesa.id)} />
                <EditButton id={`${despesa.id}`} onClick={() => handleEdit(despesa)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className='foot'>
        <Pagination>
          <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
          {pageNumbers.map(number => (
            <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => paginate(currentPage + 1)} />
        </Pagination>
        <td colSpan="6">Mostrando {currentDespesas.length} de {getTotalRegistros()} registros</td>
      </div>
    </div>
  );
}

export default TabelaDespesas;
