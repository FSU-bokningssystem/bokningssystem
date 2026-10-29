import "./App.css";
import UserPage from "./pages/UserPage";
import HomePage from "./pages/HomePage";
import HousesPage from "./pages/HousesPage";
import OneHousePage from "./pages/OneHousePage";
import HouseDetails from "./components/House/HouseDetails";
import RoomDetails from "./components/Room/RoomDetails";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Navbar } from "./components/Navbar";
import RoomPage from "./pages/RoomPage";

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
        <div className="bg-primary w-full overflow-hidden min-h-screen text-white">
          <div className="sm:px-16 px-6 flex justify-center items-center">
            <div className="xl:max-w-[1280px] w-full">
              <Navbar />
            </div>
          </div>

          <div className="sm:px-16 px-6 flex justify-center items-center">
            <div className="xl:max-w-[1280px] w-full">
              <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/users" element={<UserPage />}></Route>
                <Route path="/houses" element={<HousesPage />}></Route>
                <Route path="/houses/:houseid" element={<OneHousePage />}>
                  <Route index element={<HouseDetails />} />
                  <Route path=":roomid" element={<RoomDetails />} />
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
