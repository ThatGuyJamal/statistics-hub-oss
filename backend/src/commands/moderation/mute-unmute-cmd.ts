import { ApplyOptions } from "@sapphire/decorators";
import { Args, BucketScope } from "@sapphire/framework";
import { Message } from "discord.js";
import ms from "ms";
import { ICommandOptions, ICommand } from "../../Command";
import { memberMention } from "../../internal/functions/formatting";
import { isGuildMessage } from "../../internal/functions/guards";
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
  requiredClientPermissions: ["MODERATE_MEMBERS"],
  requiredUserPermissions: ["MODERATE_MEMBERS"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    const userToMute = await args.pick("member").catch(() => null);
    const timeToMute = await args.pick("string").catch(() => null);
    const muteReason = await args.pick("string").catch(() => "No reason provided.");

    if(!isGuildMessage) return

    const invalidReply = `Invalid arguments. Try \`mute <user> <time> (reason)\`\nExample: \`mute @user 1h "bad kids go in time out"\``;

    if (!userToMute && !timeToMute) {
      return await ctx.channel.send({
        content: invalidReply,
      });
    }

    if (!userToMute) {
      return await ctx.channel.send({
        content: invalidReply,
      });
    }

    if (userToMute === ctx.member) {
      return await ctx.channel.send({
        content: "You can't mute yourself.",
      });
    }

    if (userToMute.id === ctx.guild?.ownerId && ctx.author.id !== ctx.guild?.ownerId) {
      return await ctx.channel.send({
        content: "I can't mute the server owner.",
      });
    }

    if(userToMute.pending) {
      return await ctx.channel.send({
        content: "That user cant be muted because this member has yet to pass the servers's membership gate.",
      });
    }

    if (userToMute.user.bot) {
      return await ctx.channel.send({
        content: "I can't mute bots. If you dont want them to be able to speak, you need to change there permissions manually.",
      });
    }

    if(!userToMute.moderatable) {
      return await ctx.channel.send({
        content: "I dont have permissions to mute this user.",
      });
    } else if (!userToMute.manageable) {
      return await ctx.channel.send({
        content: "It seems this user has a higher role than me, so I can't mute them.",
      });
    }

    if (!timeToMute) {
      return await ctx.channel.send({
        content: invalidReply,
      });
    }

    const timeToMuteMs = ms(timeToMute);

    try {
      return await userToMute
        .timeout(timeToMuteMs, muteReason)
        .then((res) => {
          return ctx.channel.send({
            embeds: [
              {
                title: "Mute Successful 🔇",
                description: `${memberMention(ctx.author.id)} Muted ${memberMention(res.user.id)} for ${ms(
                  timeToMuteMs
                )} :shushing_face:`,
                color: "WHITE",
              },
            ],
          });
        })
    } catch (err) {
      this.container.client.logger.error(err);
      return ctx.channel.send({
        content: "Failed to mute user. Please make sure I have a high enough role to mute that users.",
      });
    }
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
      });
    }

    try {
    return await userToUnMute
      .timeout(null, unMuteReason)
      .then(() => {
        return ctx.channel.send({
          embeds: [
            {
              title: "Unmute Successful 🔈",
              description: `${memberMention(ctx.author.id)} Unmuted ${memberMention(userToUnMute.id)} :grinning:`,
              color: "WHITE",
            },
          ],
        });
      })
    } catch (err) {
      this.container.client.logger.error(err);
        return ctx.channel.send({
          content: "Failed to unmute user. Please make sure I have a high enough role to unmute that users.",
        });
      }
  }
}
