import React from 'react';
import Logo from './components/Logo';
//import './App.css'; // ==> ../index.html
import DatasetForm from './components/DatasetForm';
import SectionJudgeList from './components/SectionJudgeList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo className="App-logo" />
        <DatasetForm />
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
        <SectionJudgeList />
      </header>
    </div>
  );
}

export default App;
