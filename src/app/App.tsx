import React from 'react';
//import './App.css'; // ==> ../index.html
import DatasetForm from './components/DatasetForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DatasetForm />
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
