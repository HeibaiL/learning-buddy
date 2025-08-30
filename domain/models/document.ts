export type DocType = "pdf" | "txt";

export interface Document {
  id: string;
  name: string;
  type: DocType;
  size: number;
  createdAt: number;
  text: string; // нормалізований текст витягнутий з файлу
}
