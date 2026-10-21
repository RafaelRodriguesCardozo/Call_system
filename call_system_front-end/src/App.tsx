import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import CriarChamado from './pages/CriarChamados';
import ConsultarChamado from './pages/ConsultarChamados';
import ExcluirUsuarios from './pages/ExcluirUsuarios';
import CriarUsuarios from './pages/CriarUsuarios';
import GerenciarChamados from './pages/GerenciarChamados';
import { Navigate, NavLink, BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './pages/Pages.css';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
}


function App() {
  const [usuarioLogado, setUsuarioLogado] = useState <Usuario | null> (null);

  if(usuarioLogado){
    return(
      <div className="app-shell">
        <BrowserRouter>
          <header className="app-topbar">
            <div className="app-topbar-inner">
              <NavLink to="/" className="app-brand" aria-label="Central de suporte, início">
                <span className="app-brand-mark" aria-hidden="true">C</span>
                <span>
                  <strong>Central de suporte</strong>
                  <small>Atendimento e solicitações</small>
                </span>
              </NavLink>

              <div className="app-account">
                <span className="app-avatar" aria-hidden="true">
                  {usuarioLogado.nome.trim().charAt(0).toUpperCase()}
                </span>
                <span className="app-account-details">
                  <strong>{usuarioLogado.nome}</strong>
                  <small>{usuarioLogado.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</small>
                </span>
                <button
                  type="button"
                  onClick={() => setUsuarioLogado(null)}
                  className="app-logout"
                  aria-label="Sair da conta"
                >
                  Sair
                </button>
              </div>
            </div>
          </header>

          <div className="app-content">
            <nav className="app-navigation" aria-label="Navegação principal">
              <NavLink to="/" end className={({ isActive }) => `app-nav-link${isActive ? ' is-active' : ''}`}>
                <span aria-hidden="true">＋</span>
                Abrir chamado
              </NavLink>
              <NavLink to="/tickets" className={({ isActive }) => `app-nav-link${isActive ? ' is-active' : ''}`}>
                <span aria-hidden="true">▤</span>
                Consultar chamados
              </NavLink>
              {usuarioLogado.role === 'ADMIN' && (
                <>
                  <NavLink to="/gerenciarChamados" className={({ isActive }) => `app-nav-link${isActive ? ' is-active' : ''}`}>
                    <span aria-hidden="true">◷</span>
                    Gerenciar chamados
                  </NavLink>
                  <NavLink to="/criarUser" className={({ isActive }) => `app-nav-link${isActive ? ' is-active' : ''}`}>
                    <span aria-hidden="true">＋</span>
                    Criar usuário
                  </NavLink>
                  <NavLink to="/excluirUser" className={({ isActive }) => `app-nav-link${isActive ? ' is-active' : ''}`}>
                    <span aria-hidden="true">−</span>
                    Usuários
                  </NavLink>
                </>
              )}
            </nav>

            <main className="app-main">
              <Routes>
                <Route path='/' element={<CriarChamado userId={usuarioLogado.id} />}/>
                <Route path='/excluirUser' element={<ExcluirUsuarios role={usuarioLogado.role}/>}/>
                <Route path='/criarUser' element={<CriarUsuarios role={usuarioLogado.role}/>}/>
                <Route path='/gerenciarChamados' element={<GerenciarChamados role={usuarioLogado.role}/>}/>
                <Route path='/tickets' element={<ConsultarChamado />}/>
                <Route path='*' element={<Navigate to='/' />}/>
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </div>
    )
  }

  return (
    <div className="app-shell app-shell-auth">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage onLoginSuccess={setUsuarioLogado}/>}/>
          <Route path='/login' element={<LoginPage onLoginSuccess={setUsuarioLogado}/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;