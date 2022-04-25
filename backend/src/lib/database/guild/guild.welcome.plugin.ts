import { modelOptions, Severity, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
      id: false,
      collection: "guilds-welcome",
    },
    options: {
      allowMixed: Severity.ALLOW,
      runSyncIndexes: true,
    },
  })
  export class PluginDocument {
    @prop({ type: () => String, required: true })
    /**
     * Guild ID
     */
    public _id?: string;
  
    /**
     * The name of the guild
     */
    @prop({ type: () => String, required: false, default: null })
    public guild_name?: string;
  
    @prop({ type: () => Boolean, required: false, default: false })
    /**
     * If the plugin is enabled
     */
    public enabled?: boolean;
  
    /**
     * The plugin schema model
     */
    @prop({ type: () => Object, required: false, default: null })
    public schema?: any
  }
  
  export const AnyDocumentModel = getModelForClass(PluginDocument);

  /**
   * Typings for our welcome plugin
   */
  interface GuildWelcomeSchema {

    // The channels to send the welcome / leave messages to
    welcome_channel: string;
    goodbye_channel: string;

    // The message context to send during the event
    welcome_message: string;
    goodbye_message: string;
  }