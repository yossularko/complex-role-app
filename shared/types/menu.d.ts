export interface Menu {
  id: number;
  slug: string;
  name: string;
  alias: string;
  parent: string[];
  createdAt: string;
  updatedAt: string;
  children?: Menu[];
}
