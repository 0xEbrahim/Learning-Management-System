export interface IRegisterBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
}

export interface ILoginBody {
  email: string
  password: string
}