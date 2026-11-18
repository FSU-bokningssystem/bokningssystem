import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { userData, InitialData, OrganizationSummaryData, OrganizationDetailData, BookingData, AuthResponse, RegisterUser, Login } from '../types/types';
import { fetchFromApi } from '../api/fetchData';
import { postToApi } from '../api/postData';

interface AuthContextType {
	currentUser: userData | null;
	userRole: string | null;userOrganizations: OrganizationSummaryData[];
	activeOrganization: OrganizationDetailData | null;
	bookings: BookingData[];
	isAuthenticated: boolean;loading: boolean;
	login: (credentials: Login) => Promise<void>;
  register: (data: RegisterUser) => Promise<void>;
	switchOrganization: (organizationId: number) => Promise<void>;
	updateBooking: (booking: BookingData) => void;
	removeBooking: (booking: BookingData) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<userData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<OrganizationSummaryData[]>([]);
  const [activeOrganization, setActiveOrganization] = useState<OrganizationDetailData | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);

  // Starta med loading = true om en token finns, så ProtectedRoute väntar in fetchInitialData vid F5
  const [loading, setLoading] = useState<boolean>(() => Boolean(localStorage.getItem('token')));

	const fetchInitialData = async ( selectedOrgId?: number) => {
		setLoading(true);
		try {
			const savedOrgId =
				selectedOrgId ??
				(localStorage.getItem("activeOrgId")
					? Number(localStorage.getItem("activeOrgId"))
					: undefined);

			let endpoint = `user/me/context`;
			if (savedOrgId) {
				endpoint += `?selectedOrgId=${savedOrgId}`;
			}

			const data = await fetchFromApi<InitialData>(endpoint);

			setCurrentUser(data.user);
			setUserRole(data.userRole);setUserOrganizations(data.userOrganizations);
			setActiveOrganization(data.activeOrganization);
			setBookings(data.bookings);

      if (data.activeOrganization?.id) {
        localStorage.setItem('activeOrgId', data.activeOrganization.id.toString());
      } else {
        localStorage.removeItem('activeOrgId');
      }
    } catch (error) {
      console.error('Det uppstod ett fel vid hämtning av initial data:', error);
    } finally {
      setLoading(false);
    }
  };

	// Vid sidomladdning (F5): om det finns en token i localStorage, hämta användarens kontextuseEffect(() => {
		const token = localStorage.getItem('token');
    if (token) {
			fetchInitialData();
		}
	}, []);

	const login = async (credentials: Login) => {
    setLoading(true);
    try {
      const authData = await postToApi<AuthResponse>('auth/login', credentials);
      localStorage.setItem('token', authData.token);
		localStorage.removeItem("activeOrgId");
      setUserRole(authData.userRole);
		await fetchInitialData();
    } catch (error) {
      setLoading(false);
      throw error; // Skicka vidare felet så att Login-formuläret kan visa felmeddelandet
    }
  };

  const register = async (registrationData: RegisterUser) => {
    setLoading(true);
    try {
      const authData = await postToApi<AuthResponse>('auth/register', registrationData);
      localStorage.setItem('token', authData.token);
      localStorage.removeItem('activeOrgId');
      setUserRole(authData.userRole);

      await fetchInitialData();
    } catch (error) {
      setLoading(false);
      throw error; // Skicka vidare felet så att Register-formuläret kan visa felmeddelandet 
    }
	};

	const switchOrganization = async (organizationId: number) => {
		if (currentUser) {
			await fetchInitialData(organizationId);
		}
	};

	const updateBooking = (updatedBooking: BookingData) => {
		// Tar fram en ny lista med bokningar som inte innehåller den uppdaterade bokningen. Kontrollerar sedan om den inloggade användaren är ägare av den uppdaterade bokningen eller om den inloggade användaren är deltagare i bokningen, och lägger då till den uppdaterade bokningen i listan. Annars behålls bara de övriga bokningarna.

		const userId = currentUser?.id;
		if (userId == null) return;

		const withoutUpdatedBooking = bookings.filter(
			(booking) => booking.id !== updatedBooking.id,
		);

		if (
			updatedBooking.owner.id === userId ||
			updatedBooking.participants.some(
				(participant) => participant.id === userId,
			)
		) {
			setBookings([...withoutUpdatedBooking, updatedBooking]);
		} else {
			setBookings(withoutUpdatedBooking);
		}
	};

	const removeBooking = (booking: BookingData) => {
		// Tar fram en ny lista med bokningar som inte innehåller den uppdaterade bokningen. Kontrollerar sedan om den inloggade användaren är ägare av den uppdaterade bokningen eller om den inloggade användaren är deltagare i bokningen, och lägger då till den uppdaterade bokningen i listan. Annars behålls bara de övriga bokningarna.

		const userId = currentUser?.id;
		if (userId == null) return;

		setBookings(bookings.filter((b) => b.id !== booking.id));
	};

	const logout = () => {
		setCurrentUser(null);
		setUserOrganizations([]);
		setActiveOrganization(null);
		setBookings([]);
		localStorage.removeItem("activeUser");
		localStorage.removeItem("activeOrgId");
	};
  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setUserOrganizations([]);
    setActiveOrganization(null);
    setBookings([]);
    localStorage.removeItem('token');
    localStorage.removeItem('activeOrgId');
    localStorage.removeItem('activeUser');
  };

  const isAuthenticated = Boolean(currentUser && localStorage.getItem('token'));

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				userRole,userOrganizations,
				activeOrganization,
				bookings,
				isAuthenticated,loading,
				login,
        register,
				switchOrganization,
				updateBooking,
				removeBooking,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth måste användas inom en AuthProvider");
	}
	return context;
};
