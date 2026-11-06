import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { userData, InitialData, OrganizationSummaryData, OrganizationDetailData, BookingData } from '../types/types';
import { fetchFromApi } from '../api/fetchData';

interface AuthContextType {
  currentUser: userData | null;
  userOrganizations: OrganizationSummaryData[];
  activeOrganization: OrganizationDetailData | null;
  bookings: BookingData[];
  loading: boolean;
  loginAs: (userId: number, selectedOrgId?: number) => Promise<void>;
  switchOrganization: (organizationId: number) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<userData | null>(() => {
    const saved = localStorage.getItem('activeUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [userOrganizations, setUserOrganizations] = useState<OrganizationSummaryData[]>([]);
  const [activeOrganization, setActiveOrganization] = useState<OrganizationDetailData | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);

const fetchInitialData = async (userId: number, selectedOrgId?: number) => {
    setLoading(true);
    try {
      const savedOrgId = selectedOrgId ?? (localStorage.getItem('activeOrgId') ? Number(localStorage.getItem('activeOrgId')) : undefined)

      let endpoint = `user/me/context?userId=${userId}`;
      if (savedOrgId) {
        endpoint += `&selectedOrgId=${savedOrgId}`;
      }

      const data = await fetchFromApi<InitialData>(endpoint);

      setCurrentUser(data.user);
      setUserOrganizations(data.userOrganizations);
      setActiveOrganization(data.activeOrganization);
      setBookings(data.bookings);

      localStorage.setItem('activeUser', JSON.stringify(data.user));

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

  useEffect(() => {
    if (currentUser?.id) {
      fetchInitialData(currentUser.id);
    }
  }, []);

  const loginAs = async (userId: number, selectedOrgId?: number) => {
    localStorage.removeItem('activeOrgId');
    await fetchInitialData(userId, selectedOrgId);
  };

  const switchOrganization = async (organizationId: number) => {
    if (currentUser?.id) {
      await fetchInitialData(currentUser.id, organizationId);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserOrganizations([]);
    setActiveOrganization(null);
    setBookings([]);
    localStorage.removeItem('activeUser');
    localStorage.removeItem('activeOrgId');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser,
        userOrganizations,
        activeOrganization,
        bookings,
        loading,
        loginAs,
        switchOrganization,
        logout, 
        }}
        >
          {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth måste användas inom en AuthProvider');
  }
  return context;
};