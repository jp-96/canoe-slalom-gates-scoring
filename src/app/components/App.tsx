import React from 'react';
import Logo from './Logo';
import GateProvider from '../providers/GateProvider';
import SectionJudgeList from './SectionJudgeList';
//import './App.css'; // ==> ../index.html

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo className="App-logo" />
        <GateProvider>
          <SectionJudgeList />
        </GateProvider>
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
      </header>
    </div>
  );
}

export default App;
