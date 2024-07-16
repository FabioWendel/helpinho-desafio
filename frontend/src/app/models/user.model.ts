export interface UserSignup {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface UserSignin {
  email: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  id: number;
}

export interface UserUpdate {
  name: string;
  email: string;
  phone: string;
  id: number;
  password: string;
}
