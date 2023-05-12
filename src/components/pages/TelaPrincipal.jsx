import { Link } from 'react-router-dom';
import Main from '../template/Main';

const TelaPrincipal = () => (
 
    <div>
      <Main icon="home" title="Início" >
      <div className="display-4">Bem Vindo!</div>
      <h1>Home</h1>
      <Link to="/cadastro">Ir para tela de cadastro</Link><br></br>
      <Link to="/tabelaDespesas">Tabela</Link><br></br>
      </Main>
    </div>
);

export default TelaPrincipal;