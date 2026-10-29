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
