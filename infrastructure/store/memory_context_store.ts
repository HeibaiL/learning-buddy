import { ContextStore } from "@/domain/ports/context_store";
import { StudyContext } from "@/domain/models/study_context";

export class InMemoryContextStore implements ContextStore {
  private active: StudyContext | null = null;
  async setActive(ctx: StudyContext) {
    this.active = ctx;
  }
  async getActive() {
    return this.active;
  }
  async clear() {
    this.active = null;
  }
}
