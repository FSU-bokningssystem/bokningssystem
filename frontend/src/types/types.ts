export interface userData {
	email: string;
	firstName: string;
	id: number;
	lastName: string;
	phone: string;
	timeZone: string;
}

export interface userList {
	users: Array<userData>;
}

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

export interface houseList {
	houses: houseData[];
}

export interface roomData {
	id: number;
	roomNumber: string;
	floor: number;
	name: string;
	description: string;
	houseName: string;
	isAvailable: boolean;
}

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

export interface houseList {
	houses: houseData[];
}

export interface roomData {
	id: number;
	roomNumber: string;
	floor: number;
	name: string;
	description: string;
	houseName: string;
	isAvailable: boolean;
}

export interface RoomRowProps {
	room: roomData;
}

// Matchar RoomCreateDTO i backend
export interface roomCreateData {
	roomNumber: string;
	floor: number | null;
	name: string;
	description: string;
	houseId: number;
}

export interface RoomModalProps {
	onClose: () => void;
	submitData: (values: roomCreateData) => void;
}

export interface RoomListProps {
	id: number;
}

export interface CreateUserProfileDTO {
	email: string;
	password: string;
	confirmPassword?: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	timeZone?: string;
}

export interface UserModalProps {
	user: userData;
	onClose: () => void;
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

export interface BookingModalProps {
	onClose: () => void;
	submitData: (values: BookingCreateData) => void;
}

// Matchar UserResponseDTO i backend
export interface bookingUser {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string | null;
	timeZone: string | null;
}

// Matchar BookingResponseDTO i backend
export interface bookingData {
	id: number;
	title: string;
	description: string | null;
	startTime: string; // LocalDateTime i husets tidszon, t.ex. "2026-05-10T09:00:00"
	endTime: string;
	houseId: number;
	houseName: string;
	roomNumber: string;
	roomName: string;
	owner: bookingUser;
	participants: bookingUser[];
}

export interface RoomBookingDetailsProps {
	roomId: number;
}
