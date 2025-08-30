import { StudyContext } from "../models/study_context";

export interface ContextStore {
  setActive(ctx: StudyContext): Promise<void>;
  getActive(): Promise<StudyContext | null>;
  clear(): Promise<void>;
}
