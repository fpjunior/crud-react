import React, { useState, useEffect } from 'react';
import db from '../../database';
import DeleteButton from '../template/DeleteButton';
import EditButton from '../template/EditButton';
import './TabelaDespesas.css';
import { Link } from 'react-router-dom';


function TabelaDespesas() {
  // const [despesas, setDespesas] = useState([]);

  // const [despesaEditando, setDespesaEditando] = useState(null);

  const [despesas, setDespesas] = useState([]);
  const [despesaEditando, setDespesaEditando] = useState(null);


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

  return (
    <div>

      <div className='btn-cadastro'>
        <Link to="/cadastro">
          <button className="btn-salvar"  type="submit">+ Nova Despesa</button>
        </Link>
      </div>
      <table className="table-despesas">
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
          {despesas.map((despesa) => (
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
      </table>
    </div>
  );
}


export default TabelaDespesas;
