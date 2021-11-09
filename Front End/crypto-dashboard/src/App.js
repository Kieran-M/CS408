import './App.css';
import {BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';
import Market from './pages/marketPage';
import Portfolio from './pages/portfolioPage';
import Bots from './pages/botsPage';

function App() {
  return (
    <>
    <Router>
      <Routes>
      <Route path="/" element={<Market />}/>
      <Route path="/portfolio" element={<Portfolio />}/>
      <Route path="/bots" element={<Bots />}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
