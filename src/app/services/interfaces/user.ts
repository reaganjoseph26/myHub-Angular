import { Role } from './role';

export interface User {
  id?: number;
  token?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  top_developer?: boolean;
  user_profile?: UserProfile;
}

export interface LoggedInUser {
  username: string;
  password: string;
}
export interface NewUser extends User {
  password: string;
}

export interface UserProfile {
  img: string;
  bio: string;
  portfolio_link: string;
  linkedin_link: string;
  role: Role;
}
