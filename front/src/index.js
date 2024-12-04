import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './context/Context'; 
import App from './App';
import './index.css'; // Import the CSS file
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
