import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Photo from "./pages/Photo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/photo" element={<Photo />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
