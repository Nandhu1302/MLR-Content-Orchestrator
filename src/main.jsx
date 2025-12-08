import React from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import './App.css';
import App from './App';

// Removed the '!' type assertion for getElementById for JSX/JS
createRoot(document.getElementById("root")).render(<App />);