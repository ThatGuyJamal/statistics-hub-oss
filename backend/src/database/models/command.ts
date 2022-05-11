import mongo from "mongoose";

export const StatsMongoModel = mongo.model(
  "commands",
  new mongo.Schema<CommandModelStructure>({
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
    GuildDisabledCommands: {
      type: Array,
      required: false,
      default: null,
    },
    GuildDisabledCommandChannels: {
      type: Array,
      required: false,
      default: null,
    },
    GuildCustomCommands: {
      type: Object,
      required: false,
      default: {
       data: [],
        limit: 5
      },
    },
    CreatedAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
  })
);

/**
 * Typings for our mongoose document
 */
export interface CommandModelStructure {
  GuildId: string;
  GuildName?: string;
  GuildOwnerId?: string;
  GuildDisabledCommands?: string[];
  GuildDisabledCommandChannels?: string[];
  GuildCustomCommands?: {
    /** Command data */
    data: Array<CustomCommandSchema>;
    /** Max number of commands this guild can have.*/
    limit: number;
  };
  CreatedAt: Date;
}

interface CustomCommandSchema {
  /**
   * The regex pattern to match the command.
   */
  trigger: string;
  /**
   * The message to send when the command is triggered.
   */
  response: string;
  /**
   * The channel to send the message to.
   */
  channel: string;
  /**
   * The users who can use this command.
   */
  allowedUsers: string[];
}
