import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './pages/Header.jsx';
import InputScreen from './pages/InputScreen.jsx';
import OutputScreen from './pages/OutputScreen.jsx';
import ParticlesBackground from './pages/ParticlesBackground.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <Router>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}>
        <ParticlesBackground />
      </div>
      <Header />
      <Routes>
        <Route path="/" element={<InputScreen />} />
        <Route path="/output" element={<OutputScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
