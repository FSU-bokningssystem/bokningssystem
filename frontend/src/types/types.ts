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
