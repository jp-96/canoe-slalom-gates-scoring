import React from 'react';
import Logo from './Logo';
//import './App.css'; // ==> ../index.html
import GateJudge from './components/GateJudge';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo className="App-logo" />
        <p>
          Edit <code>src/app/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <GateJudge gate='11' />
        <GateJudge gate='12' defaultPenalty='0' />
        <GateJudge gate='13' defaultPenalty='2' />
        <GateJudge gate='14' defaultPenalty='50' gateColor='red' />
        <GateJudge gate='15' defaultPenalty='DNF' />
        <Logo />
      </header>
    </div>
  );
}

export default App;
