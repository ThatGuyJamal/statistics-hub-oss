import { ApplyOptions } from "@sapphire/decorators";
import { Args, BucketScope } from "@sapphire/framework";
import { Message } from "discord.js";
import ms from "ms";
import { ICommandOptions, ICommand } from "../../Command";
import { memberMention } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";

@ApplyOptions<ICommandOptions>({
    name: "mute",
    description: "Mutes a user in the server.",
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 2,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        usage: "mute <user> <time>",
        examples: ["mute @user 1h", "mute @user 1d"],
        command_type: "message",
    },
})
export class UserCommand extends ICommand {
    public async messageRun(ctx: Message, args: Args) {
        const userToMute = await args.pick("member").catch(() => null);
        const timeToMute = await args.pick("string").catch(() => null);
        const muteReason = await args.pick("string").catch(() => "No reason provided.");

        const invalidReply = `Invalid arguments. Try \`mute <user> <time> (reason)\`\nExample: \`mute @user 1h "bad kids go in time out"\``;

        if (!userToMute && !timeToMute) {
            return await ctx.channel.send({
                content: invalidReply,
            })
        }

        if (!userToMute) {
            return await ctx.channel.send({
                content: invalidReply,
            })
        }

        if(userToMute === ctx.member) {
            return await ctx.channel.send({
                content: "You can't mute yourself.",
            })
        }

        if(userToMute.id === ctx.guild?.ownerId && ctx.author.id !== ctx.guild?.ownerId) {
            return await ctx.channel.send({
                content: "I can't mute the server owner.",
            })
        }

        if (!timeToMute) {
            return await ctx.channel.send({
                content: invalidReply,
            })
        }

        const timeToMuteMs = ms(timeToMute);

        await userToMute.timeout(timeToMuteMs, muteReason).catch(() => {
            return ctx.channel.send({
                content: "Failed to mute user.",
            })
        })

        return await ctx.channel.send({
            embeds: [
                {
                    title: "Mute Successful 🔇",
                    description: `${memberMention(ctx.author.id)} Muted ${memberMention(userToMute.id)} for ${ms(timeToMuteMs)} :shushing_face:`,
                    color: "WHITE"
                }
            ]
        })
     }
}

@ApplyOptions<ICommandOptions>({
    name: "unmute",
    description: "unmute a user in the server.",
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 2,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        usage: "unmute <user>",
        examples: ["unmute @user"],
        command_type: "message",
    },
})
export class UserCommand2 extends ICommand {
    public async messageRun(ctx: Message, args: Args) {
        const userToUnMute = await args.pick("member").catch(() => null);
        const unMuteReason = await args.pick("string").catch(() => "No reason provided.");

        const invalidReply = `Invalid arguments. Try \`unmute <user> (reason)\`\nExample: \`unmute @user "learned his lesson"\``;

        if (!userToUnMute) {
            return await ctx.channel.send({
                content: invalidReply,
            })
        }

        await userToUnMute.timeout(null, unMuteReason).catch(() => {
            return ctx.channel.send({
                content: "Failed to unmute user.",
            })
        })

        return await ctx.channel.send({
            embeds: [
                {
                    title: "Unmute Successful 🔈",
                    description: `${memberMention(ctx.author.id)} Unmuted ${memberMention(userToUnMute.id)} :grinning:`,
                    color: "WHITE"
                }
            ]
        })
     }
}