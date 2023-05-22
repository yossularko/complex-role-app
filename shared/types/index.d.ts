export interface MenuAction {
  slug: string;
  actions: {
    isRead: boolean;
    isCreate: boolean;
    isUpdate: boolean;
    isDelete: boolean;
  };
}
