export interface Token {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: number;
    name: string;
    bio: string | null;
    avaImage: string | null;
    bgImage: string | null;
    userEmail: string;
  };
}

export interface AccessMenu {
  accessMenuId: number;
  id: number;
  slug: string;
  name: string;
  alias: string;
  parent: string[];
  createdAt: string;
  updatedAt: string;
  actions: string[];
  children?: AccessMenu[];
}
