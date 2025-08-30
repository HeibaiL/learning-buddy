export interface StudyContext {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  glossary?: Array<{ term: string; definition: string }>;
  createdAt: number;
}
