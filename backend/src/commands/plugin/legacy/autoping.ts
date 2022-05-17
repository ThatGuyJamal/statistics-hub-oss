import { ApplyOptions } from "@sapphire/decorators";
import { Args, BucketScope } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../../Command";
import { GuildModelEnum, GuildsMongoModel } from "../../../database/models/guild";
import { channelMention, codeBlock } from "../../../internal/functions/formatting";
import { isGuildMessage } from "../../../internal/functions/guards";
import { ProcessLegacySubCommands } from "../../../internal/functions/legacySubCommand";
import { seconds } from "../../../internal/functions/time";

const invalidArgs = codeBlock(
  "css",
  `
=== Syntax ===
[autoping] <subcommand> <channel>

=== Subcommands ===
[set] - Sets the channel to ping on user join.
[unset] - Unsets the channel to ping on user join.
[list] - Lists all channels to ping on user join.
                        `
);

@ApplyOptions<ICommandOptions>({
  name: "autoping",
  aliases: ["ap", "setap", "setautoping"],
  description: "Enables ping on user join.",
  cooldownDelay: seconds(15),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "autoping <channel>",
    examples: ["autoping set #giveaway"],
    command_type: "message",
    subcommands: ["set", "unset", "list"],
  },
  requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    if (!isGuildMessage) return;

    const subCommandArgument = await args.pick("string").catch(() => null);
    const channelArgumentOne = await args.pick("channel").catch(() => null);

    if (!ProcessLegacySubCommands(subCommandArgument, ["set", "unset", "list"])) {
      return await ctx.reply({
        content: `Invalid arguments provided.`,
        embeds: [
          {
            title: "Syntax",
            description: codeBlock(
              "css",
              `
                        === Syntax ===
                        [autoping] <subcommand> <channel>

                        === Subcommands ===
                        [set] - Sets the channel to ping on user join.
                        [unset] - Unsets the channel to ping on user join.
                        [list] - Lists all channels to ping on user join.
                        `
            ),
          },
        ],
      });
    }

    const document = await GuildsMongoModel.findOne({ GuildId: ctx.guild?.id });
    const cachedData = this.container.client.LocalCacheStore.memory.guild.get(ctx.guild!);

    if (!cachedData) {
      this.container.client.LocalCacheStore.memory.guild.set(ctx.guild!, {
        GuildId: ctx.guild!.id,
        GuildName: ctx.guild?.name,
        GuildOwnerId: ctx.guild?.ownerId,
        GuildPingOnJoinChannels: {
          data: [],
          limit: GuildModelEnum.PING_ON_JOIN_LIMIT
        },
        CreatedAt: new Date(),
      });
    }

    if (!document) {
      await GuildsMongoModel.create({
        GuildId: ctx.guild?.id,
        GuildName: ctx.guild?.name,
        GuildOwnerId: ctx.guild?.ownerId,
        GuildPingOnJoinChannels: {
          data: [],
          limit: GuildModelEnum.PING_ON_JOIN_LIMIT
        },
        CreatedAt: new Date(),
      });
    }

    const channelData = document?.GuildPingOnJoinChannels?.data ?? [];

    // Set
    if (subCommandArgument === "set") {
      if (!channelArgumentOne)
        return await ctx.reply({
          content: `Invalid arguments provided.`,
          embeds: [
            {
              title: "Syntax",
              description: invalidArgs,
            },
          ],
        });

      if (channelData.includes(channelArgumentOne.id))
        return await ctx.reply({
          content: `This channel is already set to ping on user join.`,
        });

      // Check if the data limit has been reached
      if (channelData.length === GuildModelEnum.PING_ON_JOIN_LIMIT)
        return await ctx.reply({
          content: `You already have the max amount of channels set. You have to delete some others first. Run \`autoping list\` to see the channels you have set.`,
        });

      // Add the channel id to the new array and save it to the database and cache.

      channelData.push(channelArgumentOne.id);

      try {
        this.container.client.LocalCacheStore.memory.guild.set(ctx.guild!, {
          ...cachedData,
          GuildId: ctx.guild!.id,
          GuildName: ctx.guild?.name,
          GuildOwnerId: ctx.guild?.ownerId,
          GuildPingOnJoinChannels: {
            data: channelData,
            limit: GuildModelEnum.PING_ON_JOIN_LIMIT - 1
          },
          CreatedAt: new Date(),
        });

        await GuildsMongoModel.updateOne(
          { GuildId: ctx.guild?.id },
          {
            $set: {
              GuildPingOnJoinChannels: {
                data: channelData,
                limit: GuildModelEnum.PING_ON_JOIN_LIMIT - 1
              },
            },
          }
        );
      } catch (error) {
        this.container.logger.error(error);
        return await ctx.reply({
          content: `An error occurred while trying to run this command. Please try again...`,
        });
      }

      return await ctx.reply({
        content: `Successfully set ${channelMention(channelArgumentOne.id)}!`,
      });
    } else if (subCommandArgument === "unset") {
      if (!channelArgumentOne)
        return await ctx.reply({
          content: `Invalid arguments provided.`,
          embeds: [
            {
              title: "Syntax",
              description: invalidArgs,
            },
          ],
        });

      if (!channelData.includes(channelArgumentOne.id))
        return await ctx.reply({
          content: `This channel is not set to ping on user join.`,
        });

      // Remove the channel id from the new array and save it to the database and cache.

      channelData.splice(channelData.indexOf(channelArgumentOne.id), 1);

      this.container.client.LocalCacheStore.memory.guild.set(ctx.guild!, {
        ...cachedData,
        GuildId: ctx.guild!.id,
        GuildName: ctx.guild?.name,
        GuildOwnerId: ctx.guild?.ownerId,
        GuildPingOnJoinChannels: {
          data: channelData,
          limit: GuildModelEnum.PING_ON_JOIN_LIMIT + 1
        },
        CreatedAt: new Date(),
      });

      await GuildsMongoModel.updateOne(
        { GuildId: ctx.guild?.id },
        {
          $set: {
            GuildPingOnJoinChannels: {
              data: channelData,
              limit: GuildModelEnum.PING_ON_JOIN_LIMIT + 1
            },
          },
        }
      );

      return await ctx.reply({
        content: `Successfully unset ${channelMention(channelArgumentOne.id)}!`,
      });
    } else if (subCommandArgument === "list") {
      if (channelData.length === 0)
        return await ctx.reply({
          content: `This plugin is not configured yet...`,
        });

      const channelList = channelData.map((channelId) => channelMention(channelId));

      return await ctx.reply({
        content: `The following channels are set to ping on user join: ${channelList.join(", ")}`,
      });
    }

    return await ctx.reply("Whelp...something went wrong...");
  }
}
