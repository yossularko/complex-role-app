export interface LoginInputs {
  email: string;
  password: string;
}

export interface RegisterInputs extends LoginInputs {
  name: string;
}

export interface RefreshTokenInputs {
  refresh_token: string;
}
