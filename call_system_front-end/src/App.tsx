import LoginPage from './pages/LoginPage';
import CriarChamado from './pages/CriarChamados';
import ConsultarChamado from './pages/ConsultarChamados';
import ExcluirUsuarios from './pages/ExcluirUsuarios';
import CriarUsuarios from './pages/CriarUsuarios';
import { Navigate, Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
}


function App() {
  const [usuarioLogado, setUsuarioLogado] = useState <Usuario | null> (null);

  // Verifica se o usuário fez login, se sim, renderiza a tela do sistema, caso não, permanece na tela de login ou registro.
  if(usuarioLogado){
    return(
          <Container fluid className=" bg-primary-subtle text-white min-vh-100 m-0 p-0">
        <div className='d-flex justify-content-between'>
          {/* Informações do Usuário */}
          <div className='d-flex gap-2 m-2 align-items-center' id='userinfo'>
            <small className="badge bg-secondary" >Usuário: {usuarioLogado.nome}</small>
            <small className="badge bg-secondary" >Tipo: {usuarioLogado.role}</small>
          </div>

          {/* Botão de deslogar */}
          <div className='d-flex justify-content-end'>
            <button onClick={() => setUsuarioLogado(null)} className='btn btn-danger m-2'>sair</button>
          </div>
        </div>

        <div className='container text-light bg-dark bg-gradient rounded-4 shadow p-4'>
          <BrowserRouter>
            <div className='d-flex gap-3 justify-content-center p-3'>
              <Link to='/' className='btn btn-primary'>Criar Ticket</Link>
              <Link to='/tickets' className='btn btn-primary'>Consultar tickets</Link>

              {usuarioLogado.role == 'ADMIN' && (
                <Link to='/criarUser' className='btn btn-primary'>Criar usuários</Link>
              )}

              {usuarioLogado.role === 'ADMIN' && (
                <Link to='/excluirUser' className='btn btn-danger'>Excluir Usuários</Link>  
              )}

            </div>
            
            <div className='p-3'>
              <Routes>
                <Route path='/' element={<CriarChamado userId={usuarioLogado.id} />}/>
                <Route path='/excluirUser' element={<ExcluirUsuarios role={usuarioLogado.role}/>}/>
                <Route path='/criarUser' element={<CriarUsuarios role={usuarioLogado.role}/>}/>
                <Route path='/tickets' element={<ConsultarChamado />}/>
                <Route path='*' element={<Navigate to='/' />}/>
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </Container>
    )
  }

  // Rotas Telas de login e registro de usuário.
  return (
    <div>
      <BrowserRouter>
        <nav className='d-flex gap-2 m-3'>
          <Link to='/login' className='btn btn-outline-primary'>Fazer login</Link>
        </nav>
        <Routes>
          <Route path='/' element={<LoginPage onLoginSuccess={setUsuarioLogado}/>}/>
          <Route path='/login' element={<LoginPage onLoginSuccess={setUsuarioLogado}/>}/>
          <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;