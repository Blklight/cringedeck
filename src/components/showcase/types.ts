import type { ComponentType } from "react";

export type ShowcaseDemo = ComponentType;

export type ShowcaseItem = {
  slug: string;
  name: string;
  demo: ShowcaseDemo;
};

export type ShowcaseCategory = {
  id: string;
  title: string;
  items: ShowcaseItem[];
};
