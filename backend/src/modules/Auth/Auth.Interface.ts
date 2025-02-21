export interface IRegisterBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface ICallBackReturn {
  token: string;
  refreshToken: string;
}

export interface IResetPasswordBody {
  token: string;
  password: string;
  confirmPassword: string;
}
