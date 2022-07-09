import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css'; // ==> ../index.html
import HtmlTemplateDataProvider from './providers/HtmlTemplateDataProvider';
import GateProvider from './providers/GateProvider';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HtmlTemplateDataProvider>
      <GateProvider>
        <App />
      </GateProvider>
    </HtmlTemplateDataProvider>
  </React.StrictMode>
);
