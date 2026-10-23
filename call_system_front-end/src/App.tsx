import LoginPage from './pages/Login';
import CriarChamado from './pages/CriarChamados';
import ConsultarChamado from './pages/ConsultarChamados';
import ExcluirUsuarios from './pages/ExcluirUsuarios';
import CriarUsuarios from './pages/CriarUsuarios';
import GerenciarChamados from './pages/GerenciarChamados';
import { Navigate, Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
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
      <div className="app-shell">
        <header className="app-header">
          {/* Informações do Usuário */}
          <div className="user-info" id="userinfo">
            <small className="user-chip">Usuário: {usuarioLogado.nome}</small>
            <small className="user-chip user-chip-role">Tipo: {usuarioLogado.role}</small>
          </div>

          {/* Botão de deslogar */}
          <button onClick={() => setUsuarioLogado(null)} className="button button-danger">Sair</button>
        </header>

        <main className="app-content">
          <BrowserRouter>

            <nav className="module-nav" aria-label="Módulos do sistema">
              
              {/* Rotas gerais qualquer role pode acessar */}
              <Link to="/" className="nav-link">Criar chamados</Link>
              <Link to="/tickets" className="nav-link">Consultar chamados</Link>

              {/* Rotas que só podem ter acesso caso o usuário for Administrador */}
              {usuarioLogado.role == 'ADMIN' && (
                <Link to="/gerenciarChamados" className="nav-link">Gerenciar chamados</Link>
              )}
              {usuarioLogado.role == 'ADMIN' && (
                <Link to="/criarUser" className="nav-link">Criar usuários</Link>
              )}
              {usuarioLogado.role === 'ADMIN' && (
                <Link to="/excluirUser" className="nav-link nav-link-danger">Excluir usuários</Link>
              )}
              
            </nav>
            
            <div className="module-content">
              <Routes>
                <Route path='/' element={<CriarChamado userId={usuarioLogado.id} />}/>
                <Route path='/excluirUser' element={<ExcluirUsuarios role={usuarioLogado.role}/>}/>
                <Route path='/criarUser' element={<CriarUsuarios role={usuarioLogado.role}/>}/>
                <Route path='/gerenciarChamados' element={<GerenciarChamados role={usuarioLogado.role}/>}/>
                <Route path='/tickets' element={<ConsultarChamado />}/>
                <Route path='*' element={<Navigate to='/' />}/>
              </Routes>
            </div>
          </BrowserRouter>
        </main>
      </div>
    )
  }

  // Rotas Telas de login e registro de usuário.
  return (
    <div className="public-shell">
      <BrowserRouter>
        <nav className="public-nav" aria-label="Acesso">
          <Link to="/login" className="button button-secondary">Fazer login</Link>
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