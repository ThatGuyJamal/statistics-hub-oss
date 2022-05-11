import type { CardOptions } from "discord-welcome-card/lib/types";
import mongo from "mongoose";

export const WelcomePluginMongoModel = mongo.model(
  "welcome-plugin",
  new mongo.Schema<WelcomePluginModelStructure>({
    GuildId: {
      type: String,
      required: true,
      unique: true,
    },
    GuildName: {
      type: String,
      required: false,
      default: null,
    },
    GuildOwnerId: {
      type: String,
      required: false,
      default: null,
    },
    Enabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    GuildWelcomeChannelId: {
      type: String,
      required: false,
      default: null,
    },
    GuildGoodbyeChannelId: {
      type: String,
      required: false,
      default: null,
    },
    GuildWelcomeMessage: {
      type: String,
      required: false,
      default: null,
    },
    GuildGoodbyeMessage: {
      type: String,
      required: false,
      default: null,
    },
    GuildWelcomeTheme: {
      type: String,
      required: false,
      default: "text",
    },
    CreatedAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
  })
);

export interface WelcomePluginModelStructure {
  GuildId: string;
  GuildName?: string;
  GuildOwnerId?: string;
  Enabled: boolean;
  GuildWelcomeChannelId?: string;
  GuildGoodbyeChannelId?: string;
  GuildWelcomeMessage?: string;
  GuildGoodbyeMessage?: string;
  /**
   * Theme for the welcome card. Options:
   * card, text, embed
   */
  GuildWelcomeTheme?: string;
  GuildWelcomeEmbed?: WelcomeEmbedObject;
  CreatedAt: Date;
}

export interface WelcomeEmbedObject {
  title?: string;
  description?: string;
  color?: string;
  thumbnail?: string;
  fields?: Array<WelcomeEmbedFieldObject>;
  footer?: {
    text: string;
    icon: string;
  };
  timestamp?: boolean;
  image?: string;
  author?: {
    name: string;
    icon: string;
  };
  url?: string;
}

interface WelcomeEmbedFieldObject {
  name: string;
  value: string;
  inline?: boolean;
}

export type WelcomeCardOptions = CardOptions;

export const validWelcomePluginTextSyntax = [
  "{{user.mention}}",
  "{{user.username}}",
  "{{user.id}}",
  "{{user.tag}}",
  "{{server.memberCount}}",
  "{{server.name}}",
  "{{server.id}}",
];