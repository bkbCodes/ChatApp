import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChatContext from './Context/ChatContext';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatContext/>
    </BrowserRouter>
  </React.StrictMode>
);