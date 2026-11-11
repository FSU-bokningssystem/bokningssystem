import "./App.css";
import UserPage from "./pages/UserPage";
import HomePage from "./pages/HomePage";
import HousesPage from "./pages/HousesPage";
import OneHousePage from "./pages/OneHousePage";
import HouseDetails from "./components/House/HouseDetails";
import RoomDetails from "./components/Room/RoomDetails";
import { CreateOrganizationPage } from "./pages/CreateOrganizationPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Navbar } from "./components/Navbar";
import RoomPage from "./pages/RoomPage";
import { AuthProvider } from "./context/AuthContext";
import MyBookingsPage from "./pages/MyBookingsPage";

const App = () => {
	const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
		return (
			<div
				role="alert"
				className="p-8 text-center max-w-md mx-auto my-12 bg-red-50 border border-red-200 rounded-xl text-red-900">
				<h2 className="text-xl font-bold mb-2">Något gick fel</h2>
				<pre className="text-sm bg-white p-3 rounded border border-red-100 overflow-x-auto mb-4">
					{error.message}
				</pre>
				<button
					onClick={resetErrorBoundary}
					className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition">
					Försök igen
				</button>
			</div>
		);
	};

  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthProvider>
          <div className="min-h-screen bg-[#f5f5f5] text-[#111111] flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/users" element={<UserPage />} />
                <Route path="/houses" element={<HousesPage />} />
                <Route path="/rooms" element={<RoomPage />} />
                 <Route path="/create-organization" element={<CreateOrganizationPage />} />
                <Route path="/houses/:houseid" element={<OneHousePage />}>
                  <Route index element={<HouseDetails />} />
                  <Route path=":roomNbr" element={<RoomDetails />} />
                </Route>
				<Route path="/bookings" element={<MyBookingsPage />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
