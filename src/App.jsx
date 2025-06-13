import { Routes, Route } from 'react-router-dom';
import LoginForm from './component/Login.jsx';
import Acta from './component/Instructor/acta.jsx';
import Inicio from './component/coordinacion/inicio.jsx';
import Filtro from './component/coordinacion/filtro.jsx';
import Resultados from './component/coordinacion/resultados.jsx';
import TablaActas from './component/coordinacion/actas.jsx';
import Alertas from './component/coordinacion/alertas.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/instructor/acta" element={<Acta />} />
      <Route path="/coordinacion/inicio" element={<Inicio />} />
      <Route path="/coordinacion/filtro" element={<Filtro />} />
      <Route path="/coordinacion/resultados" element={<Resultados />} />
      <Route path="/coordinacion/actas" element={<TablaActas />} />
      <Route path="/coordinacion/alertas" element={<Alertas />} />
    </Routes>
  );
}

export default App;
