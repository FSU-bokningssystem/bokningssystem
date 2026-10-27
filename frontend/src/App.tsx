import "./App.css";
import UserPage from "./pages/UserPage";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

const App = () => {
  const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
    return (
      <div role="alert">
        <h2>Något gick fel</h2>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Försök igen</button>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/users" element={<UserPage />}></Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
