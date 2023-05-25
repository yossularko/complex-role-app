import { AccessMenuPost } from "./menu";

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

export interface MenuInputs {
  name: string;
  alias: string;
  parent?: string[];
}

export interface AccessMenuInputs {
  userId: number;
  menus: AccessMenuPost[];
}

export interface TemplateMenuInputs {
  name: string;
  menus: AccessMenuPost[];
}
