import type { Channel } from "discord.js";
import mongo from "mongoose";

export const StatsMongoModel = mongo.model(
    "stats",
    new mongo.Schema<StatsModelStructure>({
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
        GuildMember: {
            type: Object,
            required: false,
            default: null,
        },
        GuildChannel: {
            type: Object,
            required: false,
            default: null,
        },
        GuildVoice: {
            type: Object,
            required: false,
            default: null,
        },
        CreatedAt: {
            type: Date,
            required: false,
            default: Date.now,
        },
}))

/**
 * Typings for our mongoose document
 */
export interface StatsModelStructure {
    GuildId: string;
    GuildName?: string;
    GuildOwnerId?: string;
    GuildMember?: GuildSchemaMemberType
    GuildMessage?: GuildSchemaMessageType
    GuildChannel?: GuildSchemaChannelType
    GuildVoice?: GuildSchemaVoiceType
    CreatedAt: Date;
}

/**
 * Typings for member data structure
 */
export interface GuildSchemaMemberType {
    guildJoins?: number;
    guildLeaves?: number;
    /** The last time a member joined the server. */
    lastJoin?: Date;
    guildBans?: number;
}

/**
 * Typings for message data structure
 */
export interface GuildSchemaMessageType {
    most_active_channels: Channel[]
    most_active_users: string[]
    message_count: number
}

/**
 * Typings for voice channel data structure
 */
export interface GuildSchemaVoiceType {
    most_active_channels: Channel[]
    most_active_users: string[]
    message_count: number
}

/**
 * Typings for guild channel data structure
 */
export interface GuildSchemaChannelType {
    created: number;
    deleted: number;
}