import type { UUID } from "crypto";
import { ColorResolvable, Snowflake } from "discord.js";

export interface SendModalSettings {
  id: UUID;
  authorId: string;
  channelId?: Snowflake;
  executor: string;
  content?: string;
  embeds?: {
    title?: string;
    description?: string;
    color?: ColorResolvable;
    thumbnail?: string;
    image?: string;
    footer?: {
      text?: string;
      icon?: string;
    };
  };
}
