
import './App.css';
import {Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/'} element={<Admin/>}/>
      </Routes>
    </div>
  );
}

export default App;
