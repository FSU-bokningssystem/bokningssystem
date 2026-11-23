/* =============================================================
   INNEHÅLL
   1. Auth        (inloggning, registrering, kontext)
   2. User        (användare)
   3. Organization (organisationer)
   4. Membership  (medlemskap och roller)
   5. House       (hus)
   6. Room        (lokaler)
   7. Booking     (bokningar)
   ============================================================= */

// =============================================================
// AUTH
// Inloggning, registrering och data som AuthContext använder
// =============================================================

export interface Login {
    email: string;
    password: string;
}

export interface RegisterUser {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
    timeZone: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    email: string;
    userRole: string;
}

// InitialData type for use in AuthContext
export interface InitialData {
    user: userData;
    userOrganizations: OrganizationSummaryData[];
    activeOrganization: OrganizationDetailData | null;
    bookings: BookingData[];
    userRole: string;
}

// =============================================================
// USER
// =============================================================

export interface userData {
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    phone: string | null;
    timeZone: string;
}

// Matchar UserShortResponseDTO i backend
export interface UserSummaryData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

// Matchar UserResponseDTO i backend
export interface BookingUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    timeZone: string | null;
}

export interface userList {
    users: Array<userData>;
}

export interface UserModalProps {
    user: userData;
    onClose: () => void;
}

// =============================================================
// ORGANIZATION
// =============================================================

export interface OrganizationSummaryData {
    id: number;
    name: string;
    memberRole: "ADMIN" | "MEMBER" | "OWNER";
}

export interface OrganizationDetailData {
    id: number;
    name: string;
    users: UserSummaryData[];
    houses: HouseDetailData[];
}

// =============================================================
// MEMBERSHIP
// Medlemskap och roller i en organisation
// =============================================================

export type MemberRole = "OWNER" | "ADMIN" | "MEMBER";

export interface Membership {
    userId: number;
    organizationId: number;
    organizationName: string;
    memberRole: MemberRole;
}

// Matchar OrgMemberDTO i backend
export interface OrgMember {
    userId: number;
    firstName: string;
    lastName: string;
    memberRole: MemberRole;
}

// =============================================================
// HOUSE
// =============================================================

export interface houseData {
    id: number;
    name: string;
    street: string;
    streetnumber: string;
    zipcode: string;
    city: string;
    organizationName: string;
    timeZone: string;
}

export interface houseWithRoomsData {
    id: number;
    name: string;
    street: string;
    streetNumber: string;
    zipCode: string;
    city: string;
    organizationName: string;
    timeZone: string;
    rooms: roomData[];
}

export interface HouseDetailData {
    id: number;
    name: string;
    street: string;
    streetNumber: string;
    zipCode: string;
    city: string;
    timeZone: string;
    rooms: RoomSummaryData[];
    owners: UserSummaryData[];
}

export interface houseList {
    houses: houseData[];
}

// =============================================================
// ROOM
// =============================================================

export interface roomData {
    id: number;
    roomNumber: string;
    floor: number;
    name: string;
    description: string | null;
    houseName: string;
    isAvailable: boolean;
}

export interface RoomSummaryData {
    id: number;
    roomNumber: string;
    floor: number;
    name: string;
    description: string | null;
    isAvailable: boolean;
}

// Matchar RoomCreateDTO i backend
export interface roomCreateData {
    roomNumber: string;
    floor: number | null;
    name: string;
    description: string;
    houseId: number;
}

// Värden som RoomModal skickar (skapa och redigera)
export interface roomFormValues {
    roomNumber: string;
    floor: number | null;
    name: string;
    description: string;
    isAvailable?: boolean;
}

export interface RoomModalProps {
    onClose: () => void;
    submitData: (values: roomFormValues) => void;
    room?: roomData;
    error?: string | null;
    onDelete?: () => void;
    deleting?: boolean;
}

export interface RoomRowProps {
    room: roomData;
}

export interface RoomListProps {
    id: number;
}

// =============================================================
// BOOKING
// =============================================================

// Matchar BookingResponseDTO i backend
export interface BookingData {
    id: number;
    title: string;
    description: string | null;
    startTime: string; // LocalDateTime i husets tidszon, t.ex. "2026-05-10T09:00:00"
    endTime: string;
    houseId: number;
    houseName: string;
    roomNumber: string;
    roomName: string;
    owner: BookingUser;
    participants: BookingUser[];
}

export interface BookingCreateData {
    houseId: number;
    roomNumber: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    ownerId: number;
}

export interface BookingEditData {
    id: number;
    roomNumber: string | null;
    houseId: number | null;
    title: string | null;
    description: string | null;
    startTime: string | null;
    endTime: string | null;
    ownerId: number | null;
}

// Matchar UserOrgBookingsDTO i backend
export interface UserOrgBookings {
    owned: BookingData[];
    participating: BookingData[];
}

export interface BookingModalProps {
    onClose: () => void;
    submitData: (values: BookingCreateData) => void;
}

export interface BookingEditModalProps {
    booking: BookingData;
    onClose: () => void;
}

export interface RoomBookingDetailsProps {
    roomId: number;
}
