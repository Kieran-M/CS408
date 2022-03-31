import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Market from "./pages/marketPage";
import Portfolio from "./pages/portfolioPage";
import Bots from "./pages/botsPage";
import Coin from "./pages/coinPage";
import Login from "./pages/loginPage";
import Signup from "./pages/signupPage";
import { RequireToken } from "./Auth";
import { createBrowserHistory } from "history";
import { AuthProvider, RequireAuth } from "react-auth-kit";

export const history = createBrowserHistory();

function App() {
  return (
    <>
      <AuthProvider authName={"_auth"} authType={"localstorage"}>
        <Router history={history}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Market />} />
            <Route
              path="/portfolio"
              element={
                <RequireAuth loginPath={'/login'}>
                  <Portfolio />
                </RequireAuth>
              }
            />
            <Route
              path="/bots"
              element={
                <RequireAuth loginPath={'/login'}>
                  <Bots />
                </RequireAuth>
              }
            />
            <Route exact path="/coin/:coinname" element={<Coin />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
