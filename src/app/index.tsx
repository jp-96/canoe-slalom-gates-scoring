import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css'; // ==> ../index.html
import AppConfigProvider from './providers/AppConfigProvider';
import GateProvider from './components/GateProvider';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppConfigProvider appConfigString={"<?= appConfigString ?>"}>
      <GateProvider>
        <App />
      </GateProvider>
    </AppConfigProvider>
  </React.StrictMode>
);
