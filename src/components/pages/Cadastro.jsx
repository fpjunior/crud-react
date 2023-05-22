import React, { useState } from 'react';
import db from '../../database';
import './Cadastro.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import AlertComponent from '../template/Alert';
import { Form, Button, FormSelect } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';


function Cadastro({ fetchDespesas, location }) {
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const [typePayment, setTypePayment] = useState('pix');
  const [valor, setValor] = useState('');
  const [date, setDate] = useState('');
  const [cadastroSucesso, setCadastroSucesso] = useState(null);
  const [cadastroErro, setCadastroErro] = useState(false);
  const [idDespesa, setIdDespesa] = useState(null);


  const { id } = useParams();

  useEffect(() => {
    if (id) {
      db.expenses.get(parseInt(id)).then((despesa) => {
        setDescricao(despesa.descricao);
        setTipo(despesa.tipo);
        setTypePayment(despesa.typePayment);
        setValor(despesa.valor);
        const [dia, mes, ano] = despesa.date.split('/');
        setDate(new Date(ano, mes - 1, dia));
      });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = date.toLocaleDateString('pt-BR');

    if (id) {
      // atualiza a despesa existente com os novos valores
      db.expenses.update(parseInt(id), { descricao, tipo, typePayment, valor, date: formattedDate })
        .then(() => {
          setDescricao('');
          setTipo('');
          setTypePayment('');
          setValor('');
          setDate('');
          setCadastroSucesso(true);
          setCadastroErro(false);
          fetchDespesas();
        })
        .catch((error) => {
          setCadastroSucesso(false);
          setCadastroErro(true);
          console.error(error)
        });
    } else {
      // adiciona uma nova despesa
      db.expenses.add({ descricao, tipo, typePayment, valor, date: formattedDate })
        .then(() => {
          setDescricao('');
          setTipo('');
          setTypePayment('');
          setValor('');
          setDate('');
          setCadastroSucesso(true);
          setCadastroErro(false);
          fetchDespesas();
        })

        .catch((error) => {
          setCadastroSucesso(false);
          setCadastroErro(true);
          console.error(error)
        }
        );
    }
  };

  return (

    <Form onSubmit={handleSubmit}>
      {cadastroSucesso && (
        <AlertComponent variant="success" content="Operação realizada com sucesso" show={cadastroSucesso} />
      )}

      {cadastroErro && (
        <AlertComponent variant="success" content="Aconteceu um erro" show={cadastroErro} />
      )}
      <div>
        <Row>
          <Col>
            <Form.Group controlId="descricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descrição da despesa"
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="tipo">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                type="text"
                placeholder="Tipo da despesa"
                value={tipo}
                onChange={(event) => setTipo(event.target.value)}>
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="typePayment">
              <Form.Label>Tipo de Pagamento</Form.Label>
              <Form.Select
                type="text"
                placeholder="Tipo de pagamento"
                value={typePayment}
                onChange={(event) => setTypePayment(event.target.value)}
              >
                <option value="pix">Pix</option>
                <option value="credito">Crédito</option>
                <option value="dinheiro">Dinheiro</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="valor">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                placeholder="Valor da despesa"
                value={valor}
                onChange={(event) => setValor(event.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="date">
              <Form.Label>Data</Form.Label>
              <DatePicker selected={date} onChange={(date) => setDate(date)} dateFormat="dd/MM/yyyy" />
            </Form.Group>
          </Col>
        </Row>

      </div>

      <div className="div-btn">
        <div>
          <button className="btn-salvar" type="submit">Salvar</button>
        </div>
        <div>
          <Link to="/tabelaDespesas">Ver tabela</Link>
        </div>
      </div>

    </Form>
  );
}

export default Cadastro;
