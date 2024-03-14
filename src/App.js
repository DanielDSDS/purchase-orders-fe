import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShowOrders } from "./components/ShowOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowOrders></ShowOrders>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
