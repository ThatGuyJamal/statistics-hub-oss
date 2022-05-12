import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, Args } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { channelMention } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";

@ApplyOptions<ICommandOptions>({
  aliases: ["clear-messages", "prune", "prune-messages", "clear"],
  description: "Purge messages in a channel.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "purge [amount] (channel)",
    examples: ["purge 10 #off-topic", "purge 5"],
    command_type: "message",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    if (!ctx.guild) return;
    const numberArg = await args.pick("number").catch(() => null);
    const channelArg = await args.pick("channel").catch(() => null);
    const channel = ctx.channel as TextChannel;

    if (!numberArg) {
      return await ctx.channel.send({
        content: "Please provide a number of messages to purge.\n Usage: `purge [amount] (channel)`",
        allowedMentions: { users: [ctx.author.id], roles: [] },
      });
    }

    // This means the user didn't provide a channel to purge from.
    if (numberArg && !channelArg) {
      try {
        const fetchedMessages = await ctx.channel.messages.fetch({ limit: numberArg + 1 ?? 1 });
        await channel.bulkDelete(fetchedMessages);

        let finishedMessage = await ctx.channel.send({
          content: `Deleted \`${fetchedMessages.size}\` messages.`,
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });

        return setTimeout(() => {
          finishedMessage.delete().catch(() => {});
        }, seconds(8));
      } catch (e) {
        // this.container.logger.error(e);
        let finishedMessage = await ctx.channel.send({
          content:
            "An error occurred while purging messages. Please make sure the messages are not older than 2 weeks.",
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });

        return setTimeout(() => {
          finishedMessage.delete().catch(() => {});
        }, seconds(8));
      }
    }

    if (!channelArg) {
      return await ctx.channel.send({
        content: "Please provide a channel to purge messages from.\n Usage: `purge [amount] (channel)`",
        allowedMentions: { users: [ctx.author.id], roles: [] },
      });
    }

    if (numberArg && channelArg) {
      const channel = ctx.guild.channels.cache.find((c) => c.id === channelArg.id) as TextChannel;

      if (!channel) {
        return await ctx.channel.send({
          content: "Please provide a valid channel.",
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });
      }

      try {
        const fetchedMessages = await channel.messages.fetch({ limit: numberArg + 1 ?? 1 });
        await channel.bulkDelete(fetchedMessages);

        let finishedMessage = await ctx.channel.send({
          content: `Successfully purged \`${numberArg + 1}\` messages from ${channelMention(channel.id)}.`,
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });

        return setTimeout(() => {
          finishedMessage.delete().catch(() => {});
        }, seconds(8));
      } catch (e) {
        return await ctx.channel.send({
          content:
            "An error occurred while purging messages. Please make sure the messages are not older than 2 weeks in the channel.",
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });
      }
    }

    return await ctx.channel.send({
      content: "Please provide a number of messages to purge.\n Usage: `purge [amount] (channel)`",
      allowedMentions: { users: [ctx.author.id], roles: [] },
    });
  }
}
