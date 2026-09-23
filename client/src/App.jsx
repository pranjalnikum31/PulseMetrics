
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Projects from './pages/Projects';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path='/projects' element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}




export default App;

