import React, { useState } from 'react';
import './Cadastro.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import AlertComponent from '../template/Alert';
import { Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';


import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import db from '../../database';
import { Button } from 'react-bootstrap';

import { RiDownloadLine } from "react-icons/ri";


function DataFile({ fetchDespesas, openModal2, closeModal, idEdit, atualizarTabela }) {
    //   const [descricao, setDescricao] = useState('');
    //   const [tipo, setTipo] = useState('despesa');
    //   const [typePayment, setTypePayment] = useState('pix');
    //   const [valor, setValor] = useState('');
    //   const [date, setDate] = useState('');
    const [cadastroSucesso, setCadastroSucesso] = useState(null);
    const [cadastroErro, setCadastroErro] = useState(false);
    //   const id = idEdit;

    //   useEffect(() => {
    //     if (id) {
    //       setCadastroSucesso(false);
    //       db.expenses.get(parseInt(id)).then((despesa) => {
    //         setDescricao(despesa.descricao);
    //         setTipo(despesa.tipo);
    //         setTypePayment(despesa.typePayment);
    //         setValor(despesa.valor);
    //         const [dia, mes, ano] = despesa.date.split('/');
    //         setDate(new Date(ano, mes - 1, dia));
    //       });
    //     } else {
    //       setDescricao('');
    //       setTipo('despesa');
    //       setTypePayment('pix');
    //       setValor('');
    //       setDate();
    //     }
    //   }, [id, openModal]);

    const handleSubmit = () => {
        atualizarTabela();
        closeModal();

    };

    const exportData = async () => {
        try {
            const dataAtual = new Date().toLocaleString('pt-br')
            const tableData = await db.expenses.toArray(); // Recupere os dados da tabela 'expenses'

            const worksheet = XLSX.utils.json_to_sheet(tableData); // Converta os dados para o formato do XLSX
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses'); // Adicione a planilha ao livro de trabalho

            const fileContent = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }); // Converta o livro de trabalho para um array de bytes

            const fileBlob = new Blob([fileContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // Crie um Blob com o conteúdo do arquivo
            saveAs(fileBlob, 'expenses' + '-' + dataAtual + '.xlsx'); // Faça o download do arquivo com o nome 'expenses.xlsx'
        } catch (error) {
            console.error('Erro ao exportar os dados:', error);
        }
    };

    const importData = async (event) => {
        try {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
                const [, ...rows] = jsonData;
                // Processar os dados importados e inserir na tabela 'expenses'
                rows.forEach(async (row) => {
                    const [descricao, tipo, typePayment, valor, date] = row;
                    await db.expenses.add({ descricao, tipo, typePayment, valor, date });
                });

                console.log('Dados importados com sucesso!');
                setCadastroSucesso(true);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            setCadastroSucesso(false);
            console.error('Erro ao importar os dados:', error);
        }
    };


    return (
        <>
            <Modal show={openModal2} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Importar/Exportar Dados</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
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
                                        <Form.Label>Salvar Dados</Form.Label>
                                        <RiDownloadLine onClick={exportData}>Exportar Dados</RiDownloadLine>

                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group controlId="tipo">
                                        <Form.Label>Backup</Form.Label>
                                        <input type="file" accept=".xlsx" onChange={importData} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div>
                                <Button onClick={handleSubmit} variant="primary" size="lg">Ok</Button>
                            </div>

                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DataFile;
