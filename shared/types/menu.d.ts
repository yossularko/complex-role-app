import { DataNode } from "antd/es/tree";

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

type MenuProp = {
  id: number;
  slug: string;
  name: string;
  alias: string;
  parent: string[];
  createdAt: string;
  updatedAt: string;
};

export type MenuNodeTree = DataNode & MenuProp;

export type MenuSelect = MenuProp & { isLeaf: boolean };

export interface AccessMenuPost {
  slug: string;
  actions: string[];
}
