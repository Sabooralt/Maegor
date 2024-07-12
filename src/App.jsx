import { BrowserRouter } from "react-router-dom";
import { ClientRoutes } from "./routes";
function App() {
  return (
    <div>
      <BrowserRouter>
        <ClientRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
