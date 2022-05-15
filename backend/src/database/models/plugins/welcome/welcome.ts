/**
 *  Statistics Hub OSS - A data analytics discord bot.
    
    Copyright (C) 2022, ThatGuyJamal and contributors
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.
 */

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
    GuildWelcomeEmbed: {
      type: Object,
      required: false,
      default: null,
    },
    GuildWelcomePingOnJoin: {
      type: Boolean,
      required: false,
      default: false,
    },
    GuildWelcomeThemeUrl: {
      type: String,
      required: false,
      default: "https://i.imgur.com/dCS4tQk.jpeg",
    },
    CreatedById: {
      type: String,
      required: false,
      default: null,
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
  GuildWelcomeThemeUrl?: string;
  GuildWelcomePingOnJoin?: boolean;
  GuildWelcomeEmbed?: WelcomeEmbedObject;
  CreatedById?: string;
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
  // User
  "{{user.mention}}",
  "{{user.username}}",
  "{{user.id}}",
  "{{user.tag}}",
  "{{user.createdAt}}",
  // Server
  "{{server.memberCount}}",
  "{{server.name}}",
  "{{server.id}}",
];
