export interface User {
  id?: number;
  token?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface LoggedInUser {
  username: string;
  password: string;
}
export interface NewUser extends User {
  password: string;
}
