import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css'; // ==> ../index.html
import App from './App';
import GateProvider from './components/GateProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GateProvider>
    <App />
  </GateProvider>
);
