import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { TabNameProvider } from './contexts/TabName.context';
import { AuthProvider } from './contexts/Auth.context';
import { NotificationProvider } from './contexts/Notification.context';

// prevents console
console.log = () => { };
console.warn = () => { };
console.error = () => { };
console.info = () => { };
console.debug = () => { };
// DOM to root
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* // router config */}
    <BrowserRouter>
      {/* auth wraper */}
      <AuthProvider>
        <NotificationProvider>
          {/* tabname context wraper */}
          <TabNameProvider>
            <App />
          </TabNameProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
