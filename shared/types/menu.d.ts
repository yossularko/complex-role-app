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

export interface TemplateMenu {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateAccsMenu {
  actions: string[];
  id: number;
  slug: string;
  name: string;
  alias: string;
  parent: string[];
  createdAt: Date;
  updatedAt: Date;
  tempAccsId: number;
}

export interface TemplateMenuDetails {
  id: number;
  name: string;
  menus: TemplateAccsMenu[];
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

export type AccsMenuSelect = MenuProp & { actions: string[]; isLeaf: boolean };

export interface AccessMenuPost {
  menuSlug: string;
  actions: string[];
}
