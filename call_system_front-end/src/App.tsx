import LoginPage from './pages/Login'
import RegisterPage from './pages/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/user' element={<RegisterPage />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;