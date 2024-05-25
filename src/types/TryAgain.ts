import { UUID } from "node:crypto";

export interface TryAgainData {
  id: UUID;
  authorId: string;
  link: string;
}
