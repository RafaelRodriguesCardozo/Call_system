import LoginPage from './pages/Login'
import RegisterPage from './pages/Register';
import CriarChamado from './pages/CriarChamados';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
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

  if(usuarioLogado){
    return(
      <>
        <CriarChamado userId={usuarioLogado.id}/>
      </>
    )
  }

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;