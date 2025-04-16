import React from 'react';
import Menu from './components/Menu/Menu';
import RPG from './components/RPG/RPG';
import Graph3D from './components/Graph3D/Graph3D';
import Graph2D from './components/Graph2D/Graph2D';
import Calculator from './components/Calculator/Calculator.js';
import Esse from './components/Esse/Esse';

import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
      this.state={
        pageName: 'Graph3D'
      };
  }

  showPage(name){
    this.setState({pageName: name});
  }

  render () {
    return (
      <div>
        <Menu showPage={(name)=> this.showPage(name)} />
        {this.state.pageName === 'Graph3D' && <Graph3D />}
        {this.state.pageName === 'RPG' && <RPG />}
        {this.state.pageName === 'Graph2D' && <Graph2D />}
        {this.state.pageName === 'Calculator' && <Calculator />}
        {this.state.pageName === 'Esse' && <Esse />}
      </div>
    );
  }
}

export default App;
