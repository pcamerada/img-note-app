import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import Detail from "./pages/Detail";
import "./App.css";
import { HelperProvider } from "./contexts/HelperContext";
import LoaderComponent from "./components/LoaderComponent";
import AlertComponent from "./components/AlertComponent";
import { ServerProvider } from "./contexts/ServerContext";

function App() {
  return (
    <HelperProvider>
      <ServerProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/detail" element={<Detail />} />
          </Routes>
        </Router>
        <LoaderComponent />
        <AlertComponent />
      </ServerProvider>
    </HelperProvider>
  );
}

export default App;
