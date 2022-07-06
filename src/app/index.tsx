import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css'; // ==> ../index.html
import AppConfigProvider from './providers/AppConfigProvider';
import GateProvider from './providers/GateProvider';
import App from './components/App';

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
