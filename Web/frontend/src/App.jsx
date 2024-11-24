import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import OptimizedRoute from "./pages/OptimizedRoute";
import ShipSelectionPage from "./pages/ShipSelect";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Algorithm from "./pages/Algorithm";
import FuelConsumption from "./pages/FuelConsumption";
import RouteTracker from "./pages/RouteTracker";
import EnginePowerSpeed from "./pages/EnginePowerSpeed";
import SelectPriorities from "./pages/SelectPriorities";
import OptimzePath from "./pages/OptimzePath";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<ShipSelectionPage/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/faqs" element={<FAQ/>} />
          <Route path="/enter-locations" element={<OptimizedRoute />} />
          <Route path="/select-ship" element={<ShipSelectionPage />} />
          <Route path="/algorithm" element={<Algorithm/>} />
          <Route path="/fuel-consumption" element={<FuelConsumption/>} />
          <Route path="/maps" element={<RouteTracker/>} />
          <Route path="/engine-power-speed" element={<EnginePowerSpeed/>} />
          <Route path="/select-priorities" element={<SelectPriorities/>} />
          <Route path="/optimize-path" element={<OptimzePath/>}/>
        </Routes>
      </Router>
    </>
  );
};

export default App;
