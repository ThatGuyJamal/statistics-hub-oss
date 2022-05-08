import { modelOptions, Severity, prop, getModelForClass } from "@typegoose/typegoose";
import type { CardOptions } from "discord-welcome-card/lib/types";

@modelOptions({
  schemaOptions: {
    id: false,
    collection: "welcome-plugin",
  },
  options: {
    allowMixed: Severity.ALLOW,
    runSyncIndexes: true,
  },
})
export class PluginDocument {
  /**
   * Guild ID
   */
  @prop({ type: () => String, required: true })
  public _id?: string;

  /**
   * The name of the guild
   */
  @prop({ type: () => String, required: false, default: null })
  public guild_name?: string;

  /**
   * If the plugin is enabled
   */
  @prop({ type: () => Boolean, required: false, default: false })
  public enabled?: boolean;

  @prop({ type: () => String, required: false, default: null })
  public welcome_channel?: string;

  @prop({ type: () => String, required: false, default: null })
  public welcome_message?: string;

  @prop({ type: () => String, required: false, default: null })
  public goodbye_channel?: string;

  @prop({ type: () => String, required: false, default: null })
  public goodbye_message?: string;

  /**
   * Checks if the welcome config should be send as an embed or not
   */
  @prop({ type: () => String, required: false, default: "text" })
  public welcome_type?: "embed" | "text" | "card";

  @prop({ type: () => Object, required: false, default: null })
  public welcome_embed?: WelcomeEmbedObject;
}

export const WelcomeDocumentModel = getModelForClass(PluginDocument);

export interface WelcomeEmbedObject {
  title?: string;
  description: string;
  color?: string;
  thumbnail?: string;
  fields?: Array<WelcomeEmbedFieldObject>;
  footer?: {
    text: string;
    icon: string;
  };
  timestamp: boolean;
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