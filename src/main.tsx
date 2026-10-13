import React from 'react';
import ReactDOM from 'react-dom/client';
import '@razorpay/blade/fonts.css';
import './styles.css';
import App from './App';
import { startI18n } from './i18n';
startI18n();
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
