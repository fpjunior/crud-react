import React, { useState } from 'react';
import './Cadastro.css';
import "react-datepicker/dist/react-datepicker.css";
import AlertComponent from '../template/Alert';
import { Form } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { BsFillCloudDownloadFill } from "react-icons/bs";

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import db from '../../database';
import { Button } from 'react-bootstrap';
import { FcCheckmark } from "react-icons/fc";
import { useEffect } from 'react';

function DataFile({ fetchDespesas, openModal2, closeModal, idEdit, atualizarTabela }) {

    const [cadastroSucesso, setCadastroSucesso] = useState(null);
    const [cadastroErro, setCadastroErro] = useState(false);
    const [dados, setDados] = useState(null);
    const [importedDataInfo, setImportedDataInfo] = useState({
        importDate: null,
        backupDate: null,
        rowCount: 0,
        dateRange: null
    });

    useEffect(() => {
  return () => {
    setCadastroSucesso(null);
  };
}, []);

    const handleSubmit = () => {
        atualizarTabela();
    };

    const fecharModal = () => {
        closeModal();
    }

    // const exportData = async () => {
    //     try {
    //         const dataAtual = new Date().toLocaleString('pt-br')
    //         const tableData = await db.expenses.toArray(); // Recupere os dados da tabela 'expenses'

    //         const worksheet = XLSX.utils.json_to_sheet(tableData); // Converta os dados para o formato do XLSX
    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses'); // Adicione a planilha ao livro de trabalho

    //         const fileContent = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }); // Converta o livro de trabalho para um array de bytes

    //         const fileBlob = new Blob([fileContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // Crie um Blob com o conteúdo do arquivo
    //         saveAs(fileBlob, 'expenses' + '-' + dataAtual + '.xlsx'); // Faça o download do arquivo com o nome 'expenses.xlsx'
    //     } catch (error) {
    //         console.error('Erro ao exportar os dados:', error);
    //     }
    // };


const exportData = async () => {
  try {
    const dataAtual = new Date().toLocaleString('pt-br');
    const tableData = await db.expenses.toArray();

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

    const fileContent = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const fileBlob = new Blob([fileContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveBackupToDevice(fileBlob, 'expenses' + '-' + dataAtual + '.xlsx');
  } catch (error) {
    console.error('Erro ao exportar os dados:', error);
  }
};

const saveBackupToDevice = (fileBlob, fileName) => {
    if (window.cordova && window.cordova.file && window.cordova.file.externalDataDirectory) {
      const fileDir = window.cordova.file.externalDataDirectory;
      const filePath = fileDir + fileName;
  
      window.resolveLocalFileSystemURL(fileDir, function (dirEntry) {
        dirEntry.getFile(fileName, { create: true }, function (fileEntry) {
          fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function() {
              // Arquivo salvo com sucesso
              // Adicione aqui o código para notificar o usuário ou realizar outras ações
              setCadastroSucesso(true);
              setTimeout(handleSubmit, 1500);
            };
            fileWriter.onerror = function(e) {
              console.error('Erro ao salvar o arquivo:', e);
              handleError(e);
            };
  
            // Converta o Blob para ArrayBuffer
            const fileReader = new FileReader();
            fileReader.onloadend = function() {
              const arrayBuffer = this.result;
  
              // Escreva o ArrayBuffer no arquivo
              fileWriter.write(arrayBuffer);
            };
            fileReader.onerror = function(e) {
              console.error('Erro ao ler o arquivo:', e);
              handleError(e);
            };
            fileReader.readAsArrayBuffer(fileBlob);
          }, handleError);
        }, handleError);
      }, handleError);
    } else {
      // Salvar o arquivo usando a biblioteca file-saver (apenas para a web)
      saveAs(fileBlob, fileName);
      setCadastroSucesso(true);
      setTimeout(handleSubmit, 1500);
    }
  };
  
const handleError = (error) => {
  console.error('Erro ao salvar o arquivo:', error);
};


    function getDatos(event) {
        setDados(event.target.files[0]);
    }

    const importData = async (event) => {
        try {
            const file = dados;
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
                // const [, ...rows] = jsonData;
                // Processar os dados importados e inserir na tabela 'expenses'
                jsonData.forEach(async (row) => {
                    const [descricao, tipo, typePayment, valor, date] = row;
                    await db.expenses.add({ descricao, tipo, typePayment, valor, date });
                });

                setCadastroSucesso(true);
                setTimeout(() => {
                    handleSubmit();
                }, 1500);

                const importDate = new Date().toLocaleString('pt-br');
                let backupDate = file.name.split('-')[1].replace('.xlsx', '');
                backupDate = backupDate.replace(/_/g, "/").replace(/,/g, " ");
                const rowCount = jsonData.length;
                const dateRange = [jsonData[0][4], jsonData[jsonData.length - 1][4]]; // Assume que a data está na coluna 4

                // Atualizar as informações do estado
                setImportedDataInfo({ importDate, backupDate, rowCount, dateRange });
                // setCadastroSucesso(true);
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
                            <AlertComponent variant="success" content="Dados importados com sucesso!" show={cadastroSucesso} />
                        )}

                        {cadastroErro && (
                            <AlertComponent variant="success" content="Aconteceu um erro" show={cadastroErro} />
                        )}
                        <div>
                            <Row className="mb-4">
                                <Col sm={3}>
                                    <Form.Label>Backup:</Form.Label>
                                </Col>
                                <Col sm={8}>
                                <Button variant="primary" onClick={exportData} style={{ background: '', border: 'none', boxShadow: 'none' }}>
                                        {/* <FcCheckmark size={35} /> */}
                                    <BsFillCloudDownloadFill ></BsFillCloudDownloadFill>
                                    </Button>
                                </Col>
                            </Row>

                            <Row >
                                <Col sm={2} className="mb-4">
                                    <Form.Label>Importar: </Form.Label>
                                </Col>
                                <Col sm={8} className="mb-4">
                                    <Form.Control type="file" accept=".xlsx" onChange={getDatos} />
                                </Col>

                                <Col sm={2} className="mb-4">
                                    <Button variant="primary" onClick={importData} style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                                        <FcCheckmark size={35} />
                                    </Button>
                                </Col>
                            </Row>

                            <div>
                            </div>

                        </div>

                    </Form>

                    <div>
                        {importedDataInfo.importDate && (
                            <p>Data da última importação: {importedDataInfo.importDate}</p>
                        )}
                        {importedDataInfo.backupDate && (
                            <p>Data do backup importado: {importedDataInfo.backupDate}</p>
                        )}
                        {importedDataInfo.rowCount > 0 && (
                            <p>Registros importados: {importedDataInfo.rowCount}</p>
                        )}
                        {importedDataInfo.dateRange && (
                            <p>Intervalo de datas: {importedDataInfo.dateRange[0]} - {importedDataInfo.dateRange[1]}</p>
                        )}
                    </div>

                    <Col sm={2} className="mb-4">
                        <Button variant="primary" onClick={fecharModal}>
                            OK</Button>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DataFile;
