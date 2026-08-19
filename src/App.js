import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './pages/login.jsx';
import Dashboard from './pages/dashboard.jsx';
import Registration from './pages/registration.jsx';
import Quiz from './pages/quiz.jsx';
import Result from './pages/profile.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/profile" element={<Result />} />
        <Route path="/quiz/:category" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;