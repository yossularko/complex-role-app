export interface MenuAction {
  slug: string;
  actions: {
    isRead: boolean;
    isCreate: boolean;
    isUpdate: boolean;
    isDelete: boolean;
  };
}

export interface UserList {
  id: number;
  profile: {
    id: number;
    name: string;
    bio: string | null;
    avaImage: string | null;
    bgImage: string | null;
    userEmail: string;
  };
}
