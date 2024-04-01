import React from "react";
import NaviBar from './Components/Navibar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {Home} from './Home';
import SpecificationInterface from './SpecificationInterface';
import {Order} from './Order';
import {Stock} from './Stock';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
          <NaviBar />
          <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Specification" element={<SpecificationInterface />} />
          <Route path="/Order" element={<Order/>} />
          <Route path="/Stock" element={<Stock/>} />
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
