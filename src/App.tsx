import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from './pages/Gallery';
import Detail from './pages/Detail';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </Router>
  )
}

export default App
