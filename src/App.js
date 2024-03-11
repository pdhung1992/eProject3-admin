
import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import Admin from "./pages/Admin";
import LogIn from "./pages/LogIn";
import {useSelector} from "react-redux";

function PrivateRoute({ element, roles }) {
    const adm = useSelector(state => state.auth);
    if (!adm.admData) {
        // if not logged in
        return <Navigate to="/login"/>;
    }
    return element;

}

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/*'}
               element={<PrivateRoute element={<Admin/>}/>}/>
          <Route path={'/login'} element={<LogIn/>}/>
      </Routes>
    </div>
  );
}

export default App;
