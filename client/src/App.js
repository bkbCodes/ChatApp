import './App.css';
import Chats from './Pages/Chats';
import axios from 'axios'
import { Routes, Route } from 'react-router-dom';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';

axios.defaults.baseURL = "http://localhost:8000/";

function App() {
  axios.get("/").catch(err => console.error(err))
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/app" element={<Chats />} />
    </Routes>
  );
}

export default App;
