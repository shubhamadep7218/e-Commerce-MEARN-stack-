
import './App.css';
import Header from './components/layout/Header.js'
import {BrowserRouter as Router} from "react-router-dom"

function App() {
  return (
    <div>
      <Router>
        <Header />
      </Router>
    </div>
  );
}

export default App;
