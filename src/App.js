import {useState} from 'react';
import Menu from './components/Menu/Menu';
import RPG from './components/RPG/RPG';
import Graph3D from './components/Graph3D/Graph3D';
import Graph2D from './components/Graph2D/Graph2D';
import Calculator from './components/Calculator/Calculator.js';
import Esse from './components/Esse/Esse';

import './App.css';

const App = () => {
    const [page, setPage] = useState('Graph3D')
    return (
      <div>
        <Menu showPage={setPage} />
        {page === 'Graph3D' && <Graph3D />}
        {page === 'RPG' && <RPG />}
        {page === 'Graph2D' && <Graph2D />}
        {page === 'Calculator' && <Calculator />}
        {page === 'Esse' && <Esse />}
      </div>
    );
}

export default App;
