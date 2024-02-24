
import './App.css';
import {Route, Routes} from "react-router-dom";
import Admin from "./pages/Admin";
import LogIn from "./pages/LogIn";

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/'} element={<Admin/>}/>
          <Route path={'/login'} element={<LogIn/>}/>
      </Routes>
    </div>
  );
}

export default App;
