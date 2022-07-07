import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css'; // ==> ../index.html
import HtmlTemplateParameterProvider from './providers/HtmlTemplateParameterProvider';
import App from './components/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HtmlTemplateParameterProvider>
      <App />
    </HtmlTemplateParameterProvider>
  </React.StrictMode>
);
