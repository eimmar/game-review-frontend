import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Home from "./components/Home";
import '@elastic/eui/src/theme_light.scss'
import './App.css';

function App() {
  return (
      <BrowserRouter>
        <div>
          <Home/>
        </div>
      </BrowserRouter>
  );
}

export default App;
