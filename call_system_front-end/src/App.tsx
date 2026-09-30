import LoginPage from './pages/Login'
import RegisterPage from './pages/Register';
import CriarChamado from './pages/CriarChamados';
import ConsultarChamado from './pages/ConsultarChamados';
import AdminPage from './pages/AdminPage';
import { Navigate, Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <div>
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

        <div className='container mt-4 p-5 text-light bg-dark rounded-4 shadow'>
          <BrowserRouter>
            <Link to='/' className='btn btn-primary'>Criar Ticket</Link>
            <Link to='/tickets' className='btn btn-primary m-2'>Consultar tickets</Link>
            {usuarioLogado.role === 'ADMIN' && (
              <Link to='/admin' className='btn btn-danger m-2'>Excluir Usuários</Link> 
            )} 
            <Routes>
              <Route path='/' element={<CriarChamado userId={usuarioLogado.id} />}/>
              <Route path='/admin' element={<AdminPage role={usuarioLogado.role}/>}/>
              <Route path='/tickets' element={<ConsultarChamado />}/>
              <Route path='*' element={<Navigate to='/' />}/>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    )
  }

// Rotas Telas de login e registro de usuário.
  return (
    <>
      <BrowserRouter>
        <nav className='d-flex gap-2 m-3'>
          <Link to='/user' className='btn btn-outline-primary'>Registrar-se</Link>
          <Link to='/login' className='btn btn-outline-primary'>Fazer login</Link>
        </nav>
        <Routes>
          <Route path='/' element={<LoginPage onLoginSuccess={setUsuarioLogado}/>}/>
          <Route path='/login' element={<LoginPage onLoginSuccess={setUsuarioLogado}/>}/>
          <Route path='/user' element={<RegisterPage />}/>
          <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;