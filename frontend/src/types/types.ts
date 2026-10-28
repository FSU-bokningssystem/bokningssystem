export interface userData {
	email: string;
	firstName: string;
	id: number;
	lastName: string;
	phone: string;
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

export interface houseList {
	houses: Array<houseData>;
}
