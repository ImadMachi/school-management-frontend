import { CategoryType } from "./categoryTypes";

export type TemplateType = {
  id: number;
  title: string;
  description: string;
  subject: string;
  body: string;
  category: CategoryType;
};
