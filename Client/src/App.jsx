import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import '../src/App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
