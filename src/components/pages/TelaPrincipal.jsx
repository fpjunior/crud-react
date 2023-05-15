import { Link } from 'react-router-dom';
import Main from '../template/Main';

const TelaPrincipal = () => (
 
    <div>
      <div className="display-6">Bem Vindo!</div>
      <h1>Personal Manager</h1>
      <Link to="/cadastro">Ir para tela de cadastro</Link><br></br>
      <Link to="/tabelaDespesas">Tabela</Link><br></br>
    </div>
);

export default TelaPrincipal;