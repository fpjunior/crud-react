import React, { useState } from 'react';
import db from '../../database';
import './Cadastro.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';

function Cadastro({ fetchDespesas, location }) {
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [date, setDate] = useState('');
  const [cadastroSucesso, setCadastroSucesso] = useState(false);


  const { id } = useParams();

  if (id) {
    db.expenses.get(parseInt(id)).then((despesa) => {
      setDescricao(despesa.descricao);
      setTipo(despesa.tipo);
      setValor(despesa.valor);
      const [dia, mes, ano] = despesa.date.split('/');
      setDate(new Date(ano, mes - 1, dia));
    });
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = date.toLocaleDateString('pt-BR');
    console.log(formattedDate);

    db.expenses.put({ id, descricao, tipo, valor, date: formattedDate })
      .then(() => {
        setDescricao('');
        setTipo('');
        setDate('');
        setValor('');
        setCadastroSucesso(true);
        fetchDespesas();
      })
      .catch((error) => console.error(error));
  };


  return (
    <form onSubmit={handleSubmit} className="form-cadastro">
      {cadastroSucesso && <p>Cadastro realizado com sucesso!</p>}

      <div>
        <label htmlFor="descricao">Descrição:</label>
        <input type="text" id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </div>

      <div>
        <label htmlFor="date">Data:</label>
        <DatePicker selected={date} onChange={(date) => setDate(date)} dateFormat="dd/MM/yyyy" />
      </div>

      <div className="input-tipo">
        <label htmlFor="tipo">Tipo:</label>
        <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
      </div>

      <div>
        <label htmlFor="valor">Valor:</label>
        <input type="number" id="valor" value={valor} onChange={(e) => setValor(e.target.value)} />
      </div>

      <div>
        <button className="btn-salvar" type="submit">Salvar</button>
      </div>
      <div>
        <Link to="/tabelaDespesas">Ver tabela</Link>
      </div>
    </form>
  );
}

export default Cadastro;
