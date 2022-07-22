import SignIn from './components/login';
import SignUp from './components/registration';
import { Routes, Route} from "react-router-dom";
import HomePage from './components/homePage';
import ChangePassword from './components/changePassword';
import ResetPassword from './components/resetPassword';

function App() {
  return (
    <Routes>
    <Route path="/" element={<HomePage/>} />
    <Route path="/register" element={<SignUp/>} />
    <Route path="/login" element={<SignIn/>} />
    <Route path="/change" element={<ChangePassword/>} />
    <Route path="/forgot" element={<ResetPassword/>} />
    </Routes>
  );
}

export default App;
