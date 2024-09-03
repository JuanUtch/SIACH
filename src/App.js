import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Login from './componentes/login'; // Asegúrate de que el componente Login esté correctamente importado

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
        <Routes>
            <Route path="/" element={<h1 className='text'>Bienvenido a la Página de Inicio</h1>} />
            <Route path="/login" element={<Login />} />
          </Routes>
          {/* Menú de navegación */}
          <div className="navbar">
            <Link to="/">
              <button className="btn btn-primary">Inicio</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-primary">Iniciar Sesión</button>
            </Link>
          </div>
          {/* Rutas */}
          
        </header>
      </div>
    </Router>
  );
}

export default App;