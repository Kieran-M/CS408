import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Market from "./pages/marketPage";
import Portfolio from "./pages/portfolioPage";
import Bots from "./pages/botsPage";
import Coin from "./pages/coinPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/bots" element={<Bots />} />
          <Route path="/coin/:coinname" element={<Coin />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
