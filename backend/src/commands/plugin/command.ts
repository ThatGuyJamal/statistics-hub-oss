import { ApplyOptions } from "@sapphire/decorators";
import {
  BucketScope,
  ApplicationCommandRegistry,
  RegisterBehavior,
  ChatInputCommand,
  Args,
  container,
} from "@sapphire/framework";
import { codeBlock } from "@sapphire/utilities";
import { Message, TextChannel } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { CommandPluginMongoModel } from "../../database/models/command";
import stripIndent, { channelMention } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";
import { BaseEmbed } from "../../internal/structures/Embed";

const subCommandList = ["enable", "disable", "enable-channel", "disable-channel", "e", "d", "ec", "dc", "list", "l"];

const messageCommandNoSubCommandReply = codeBlock(
  "css",
  `
=== Command Plugin Syntax ===
[subcommand] [type] [value] (value)

=== Subcommands ===
enable: Enables a command.
disable: Disables a command.
enable-channel: Enables a command in a channel.
disable-channel: Disables a command in a channel.

=== Subcommand Aliases ===
e: enable
d: disable
ec: enable-channel
dc: disable-channel
l: list

=== Examples ===
command e ping => Enables the ping command.
command d ping => Disables the ping command.
command ec ping #general => Enables commands to be ran in the #general channel.
command dc ping #general => Disables commands to be ran in the #general channel.
`
);

const allValidCommands = [...container.stores.get("commands").values()].map((c) => c.name);

@ApplyOptions<ICommandOptions>({
  aliases: ["cmd"],
  description: "Configure the command plugin.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "command [enable/disable] [command/channel]",
    examples: ["command d <command>", "command e <command>", "command dc <channel>", "command ec <channel>"],
    command_type: "both",
    subcommands: ["enable", "disable", "list", "enable-channel", "disable-channel"],
  },
  requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    if (!ctx.guild) return;
    const { client } = this.container;

    const subCommand = await args.pick("string").catch(() => null);

    // Check if the subcommand is valid
    if (!subCommand) {
      return await ctx.reply({
        content: messageCommandNoSubCommandReply,
      });
    }

    //Check if the first argument was a valid subcommand
    if (!subCommandList.includes(subCommand)) {
      return await ctx.reply({
        content: messageCommandNoSubCommandReply,
        // embeds: [
        //     new BaseEmbed().contextEmbed({
        //         description: messageCommandNoSubCommandReply
        //     }, ctx)
        // ]
      });
    }

    const commandCache = client.LocalCacheStore.memory.plugins.commands.get(ctx.guild!);
    const document = await CommandPluginMongoModel.findOne({ GuildId: ctx.guild.id });

    if (!commandCache) {
      client.LocalCacheStore.memory.plugins.commands.set(ctx.guild, {
        GuildId: ctx.guild.id,
        GuildName: ctx.guild.name,
        GuildOwnerId: ctx.guild.ownerId,
        GuildCustomCommands: {
          data: [],
          limit: 5,
        },
        GuildDisabledCommandChannels: [],
        GuildDisabledCommands: [],
        CreatedAt: new Date(),
      });
    }

    if (!document) {
      await CommandPluginMongoModel.create({
        GuildId: ctx.guild.id,
        GuildName: ctx.guild.name,
        GuildOwnerId: ctx.guild.ownerId,
        GuildCustomCommands: {
          data: [],
          limit: 5,
        },
        GuildDisabledCommandChannels: [],
        GuildDisabledCommands: [],
        CreatedAt: new Date(),
      });
    }

    if (subCommand === "enable" || subCommand === "e") {
      const commandEnabledArgument = await args.pick("string").catch(() => null);

      if (!commandEnabledArgument) {
        return ctx.reply({
          content: `You must provide a command to enable.\n Syntax: \`command enable <name>\``,
        });
      }

      if (!allValidCommands.includes(commandEnabledArgument)) {
        return ctx.reply({
          content: `The command \`${commandEnabledArgument}\` does not exist.`,
        });
      }

      if (commandEnabledArgument === "command" || commandEnabledArgument === "cmd") {
        return ctx.reply({
          content: `You cannot disable the command plugin.`,
        });
      }

      if (!commandCache?.GuildDisabledCommands?.includes(commandEnabledArgument)) {
        return ctx.reply({
          content: `The command \`${commandEnabledArgument}\` is not disabled.`,
        });
      }

      const disabledCommands = commandCache.GuildDisabledCommands;
      // Remove the command from the disabled list
      disabledCommands.splice(disabledCommands.indexOf(commandEnabledArgument), 1);
      // Set the disabled commands in the cache
      client.LocalCacheStore.memory.plugins.commands.set(ctx.guild, {
        ...commandCache,
        GuildDisabledCommands: disabledCommands,
      });
      // Set the disabled commands in the database
      await document?.updateOne({
        $set: {
          GuildDisabledCommands: disabledCommands,
        },
      });

      return await ctx.reply({
        content: `The command \`${commandEnabledArgument}\` has been enabled.`,
      });
    }

    if (subCommand === "disable" || subCommand === "d") {
      const commandDisabledArgument = await args.pick("string").catch(() => null);

      if (!commandDisabledArgument || !allValidCommands.includes(commandDisabledArgument)) {
        return await ctx.reply({
          content: `You must provide a command to disable.\n Syntax: \`command disable <name>\``,
        });
      }

      if (!allValidCommands.includes(commandDisabledArgument)) {
        return ctx.reply({
          content: `The command \`${commandDisabledArgument}\` does not exist.`,
        });
      }

      if (commandDisabledArgument === "command" || commandDisabledArgument === "cmd") {
        return ctx.reply({
          content: `You cannot disable the command plugin.`,
        });
      }

      if (commandCache?.GuildDisabledCommands?.includes(commandDisabledArgument)) {
        return await ctx.reply({
          content: `The command \`${commandDisabledArgument}\` is already disabled.`,
        });
      }

      let disabledCommands = commandCache?.GuildDisabledCommands;

      if (!disabledCommands) disabledCommands = [];

      // Add the command to the disabled list
      disabledCommands.push(commandDisabledArgument);
      // Set the disabled commands in the cache
      client.LocalCacheStore.memory.plugins.commands.set(ctx.guild, {
        ...commandCache,
        GuildId: ctx.guild.id,
        CreatedAt: new Date(),
        GuildDisabledCommands: disabledCommands || [],
      });
      // Set the disabled commands in the database
      await document?.updateOne({
        $set: {
          GuildDisabledCommands: disabledCommands,
        },
      });

      return await ctx.reply({
        content: `The command \`${commandDisabledArgument}\` has been disabled.`,
      });
    } else if (subCommand === "disable-channel" || subCommand === "dc") {
      const commandChannelArgument = (await args.pick("channel").catch(() => null)) as TextChannel | null;

      if (!commandChannelArgument) {
        return await ctx.reply({
          content: `You must provide a channel to enable.\n Syntax: \`command disable-channel <channel>\``,
        });
      }

      if (commandCache?.GuildDisabledCommandChannels?.includes(commandChannelArgument.id)) {
        return await ctx.reply({
          content: `The channel ${channelMention(commandChannelArgument.id)} is already disabled.`,
        });
      }

      let disabledCommandChannels = commandCache?.GuildDisabledCommandChannels;

      if (!disabledCommandChannels) disabledCommandChannels = [];

      // Add the channel to the disabled list
      disabledCommandChannels.push(commandChannelArgument.id);
      // Set the disabled channels in the cache
      client.LocalCacheStore.memory.plugins.commands.set(ctx.guild, {
        ...commandCache,
        GuildId: ctx.guild.id,
        CreatedAt: new Date(),
        GuildDisabledCommandChannels: disabledCommandChannels || [],
      });

      // Set the disabled channels in the database
      await document?.updateOne({
        $set: {
          GuildDisabledCommandChannels: disabledCommandChannels,
        },
      });

      return await ctx.reply({
        content: `The channel ${channelMention(commandChannelArgument.id)} has been disabled.`,
      });
    } else if (subCommand === "enable-channel" || subCommand === "ec") {
      const commandChannelArgument = (await args.pick("channel").catch(() => null)) as TextChannel | null;

      if (!commandChannelArgument) {
        return await ctx.reply({
          content: `You must provide a channel to enable.\n Syntax: \`command enable-channel <channel>\``,
        });
      }

      if (!commandCache?.GuildDisabledCommandChannels?.includes(commandChannelArgument.id)) {
        return await ctx.reply({
          content: `The channel ${channelMention(commandChannelArgument.id)} is not disabled.`,
        });
      }

      const disabledCommandChannels = commandCache.GuildDisabledCommandChannels;
      // Remove the channel from the disabled list
      disabledCommandChannels.splice(disabledCommandChannels.indexOf(commandChannelArgument.id), 1);
      // Set the disabled channels in the cache
      client.LocalCacheStore.memory.plugins.commands.set(ctx.guild, {
        ...commandCache,
        GuildId: ctx.guild.id,
        CreatedAt: new Date(),
        GuildDisabledCommandChannels: disabledCommandChannels,
      });

      // Set the disabled channels in the database
      await document?.updateOne({
        $set: {
          GuildDisabledCommandChannels: disabledCommandChannels,
        },
      });

      return await ctx.reply({
        content: `The channel ${channelMention(commandChannelArgument.id)} has been enabled.`,
      });
    } else if (subCommand === "list" || subCommand === "l") {
      const disabledCommands = commandCache?.GuildDisabledCommands;
      const disabledChannels = commandCache?.GuildDisabledCommandChannels;

      if (!disabledCommands && !disabledChannels) {
        await ctx.channel.send({
          content: `No commands or channels are disabled.`,
        });
        return await ctx.reply({
          content: messageCommandNoSubCommandReply,
        });
      }

      return await ctx.reply({
        embeds: [
          new BaseEmbed().contextEmbed(
            {
              description: stripIndent(
                `
=== Disabled Commands ===
${disabledCommands?.join(", ") || "No commands are disabled."}

=== Disabled Channels ===
${disabledChannels?.map((id) => channelMention(id)).join(", ") || "No channels are disabled."}

__**Notes**__

> 1. If you dont see a command or channel, it means it is not disabled.
> 2. To disable a command, use \`command disable <name>\`.
> 3. To disable a channel, use \`command disable-channel <channel>\`.
`
              ),
            },
            ctx
          ),
        ],
      });
    }

    return await ctx.reply({
      content: `Invalid subcommand.\nSyntax: \`command <subcommand>\``,
    });
  }
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {

    const { client } = this.container

    if(!interaction.guild) return

    const cachedData = client.LocalCacheStore.memory.plugins.commands.get(interaction.guild);
    const document = await CommandPluginMongoModel.findOne({ GuildId: interaction.guild.id });

    if (!cachedData) {
      client.LocalCacheStore.memory.plugins.commands.set(interaction.guild, {
        GuildId: interaction.guild.id,
        GuildName: interaction.guild.name,
        GuildOwnerId: interaction.guild.ownerId,
        CreatedAt: new Date(),
        GuildDisabledCommands: [],
        GuildDisabledCommandChannels: [],
        GuildCustomCommands: {
          data: [],
          limit: 5,
        }
      })
    }

    if (!document) {
      await CommandPluginMongoModel.create({
        GuildId: interaction.guild.id,
        GuildName: interaction.guild.name,
        GuildOwnerId: interaction.guild.ownerId,
        CreatedAt: new Date(),
        GuildDisabledCommands: [],
        GuildDisabledCommandChannels: [],
        GuildCustomCommands: {
          data: [],
          limit: 5,
        }
      })
    }

    if (interaction.options.getSubcommand() === "disable") {
      await interaction.deferReply({
        ephemeral: true,
      })
      let disableCommandArg = interaction.options.getString("disable-command", true);
      
      // Stop the user from disabling this command
      if (disableCommandArg === "command") {
        return interaction.editReply({
          content: `You cannot disable this command as it would stop you from being able to restore other commands.`,
        });
      }

      // Check if the command exists
      if(!allValidCommands.includes(disableCommandArg)) {
        return interaction.editReply({
          content: `The command \`${disableCommandArg}\` does not exist.`,
        });
      }

      // Check if the command is already disabled
      if(cachedData?.GuildDisabledCommands?.includes(disableCommandArg)) {
        return interaction.editReply({
          content: `The command \`${disableCommandArg}\` is already disabled.`,
        });
      }

      // Add the command to the disabled list
      let disabledCommands = cachedData?.GuildDisabledCommands || [];
      disabledCommands?.push(disableCommandArg)
      // Set the disabled commands in the cache
      client.LocalCacheStore.memory.plugins.commands.set(interaction.guild, {
        ...cachedData,
        GuildId: interaction.guild.id,
        CreatedAt: new Date(),
        GuildDisabledCommands: disabledCommands,
      });

      // Set the disabled commands in the database
      await document?.updateOne({
        $set: {
          GuildDisabledCommands: disabledCommands,
        },
      });

      return interaction.editReply({
        content: `The command \`${disableCommandArg}\` has been disabled.`,
      });
    } else if (interaction.options.getSubcommand() === "enable") {
      await interaction.deferReply({
        ephemeral: true,
      })

      let enableCommandArg = interaction.options.getString("enable-command", true);

      // Check if the command exists
      if(!allValidCommands.includes(enableCommandArg)) {
        return interaction.editReply({
          content: `The command \`${enableCommandArg}\` does not exist.`,
        });
      }

      // Check if the command is already enabled
      if(!cachedData?.GuildDisabledCommands?.includes(enableCommandArg)) {
        return interaction.editReply({
          content: `The command \`${enableCommandArg}\` is already enabled.`,
        });
      }

      // Remove the command from the disabled list
      let disabledCommands = cachedData?.GuildDisabledCommands || [];
      disabledCommands?.splice(disabledCommands.indexOf(enableCommandArg), 1);
      // Set the disabled commands in the cache
      client.LocalCacheStore.memory.plugins.commands.set(interaction.guild, {
        ...cachedData,
        GuildId: interaction.guild.id,
        CreatedAt: new Date(),
        GuildDisabledCommands: disabledCommands,
      });

      // Set the disabled commands in the database
      await document?.updateOne({
        $set: {
          GuildDisabledCommands: disabledCommands,
        },
      });

      return interaction.editReply({
        content: `The command \`${enableCommandArg}\` has been enabled.`,
      });
    } else if (interaction.options.getSubcommand() === "disable-channel") {
      await interaction.deferReply({
        ephemeral: true,
      })

      let disableChannelArg = interaction.options.getChannel("disable-channel", true) as TextChannel;
      
      // Check if the channel is already disabled
      if(cachedData?.GuildDisabledCommandChannels?.includes(disableChannelArg.id)) {
        return interaction.editReply({
          content: `The channel ${channelMention(disableChannelArg.id)} is already disabled.`,
        });
      }

      // Add the channel to the disabled list
      let disabledChannels = cachedData?.GuildDisabledCommandChannels;
      disabledChannels?.push(disableChannelArg.id);
      // Set the disabled channels in the cache
      client.LocalCacheStore.memory.plugins.commands.set(interaction.guild, {
        ...cachedData,
        GuildId: interaction.guild.id,
        CreatedAt: new Date(),
        GuildDisabledCommandChannels: disabledChannels,
      });

      // Set the disabled channels in the database
      await document?.updateOne({
        $set: {
          GuildDisabledCommandChannels: disabledChannels,
        },
      });

      return interaction.editReply({
        content: `The channel ${channelMention(disableChannelArg.id)} has been disabled.`,
      });

    } else if (interaction.options.getSubcommand() === "enable-channel") {
      await interaction.deferReply({
        ephemeral: true,
      })

      let enableChannelArg = interaction.options.getChannel("enable-channel", true) as TextChannel;
      
      // Check if the channel is already enabled
      if(!cachedData?.GuildDisabledCommandChannels?.includes(enableChannelArg.id)) {
        return interaction.editReply({
          content: `The channel ${channelMention(enableChannelArg.id)} is already enabled.`,
        });
      }

      // Remove the channel from the disabled list
      let disabledChannels = cachedData?.GuildDisabledCommandChannels;
      disabledChannels?.splice(disabledChannels.indexOf(enableChannelArg.id), 1);
      // Set the disabled channels in the cache
      client.LocalCacheStore.memory.plugins.commands.set(interaction.guild, {
        ...cachedData,
        GuildId: interaction.guild.id,
        CreatedAt: new Date(),
        GuildDisabledCommandChannels: disabledChannels,
      });

      // Set the disabled channels in the database
      await document?.updateOne({
        $set: {
          GuildDisabledCommandChannels: disabledChannels,
        },

      });

      return interaction.editReply({
        content: `The channel ${channelMention(enableChannelArg.id)} has been enabled.`,
      });
    } else if (interaction.options.getSubcommand() === "list") {
      await interaction.deferReply({
        ephemeral: true,
      })

      let disabledCommands = cachedData?.GuildDisabledCommands;
      let disabledChannels = cachedData?.GuildDisabledCommandChannels;

      if(!disabledCommands?.length && !disabledChannels?.length) {
        return interaction.editReply({
          content: `No commands or channels are disabled.`,
        });

      } else {
        return await interaction.editReply({
          embeds: [
            new BaseEmbed().interactionEmbed(
              {
                description: stripIndent(
                  `
=== Disabled Commands ===
${disabledCommands?.join(", ") || "No commands are disabled."}

=== Disabled Channels ===
${disabledChannels?.map((id) => channelMention(id)).join(", ") || "No channels are disabled."}

__**Notes**__

> 1. If you dont see a command or channel, it means it is not disabled.
> 2. To disable a command, use \`command disable <name>\`.
> 3. To disable a channel, use \`command disable-channel <channel>\`.
`
                ),
              },
              interaction
            ),
          ],
        });
      }
    }

    return 
  }

  // ["enable", "disable", "delete", "list", "enable-channel", "disable-channel"]

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => 
    builder.setName(this.name)
    .setDescription(this.description)
        .addSubcommand((options) => options.setName("disable").setDescription("Disable a command.").addStringOption((option) => option.setName("disable-command").setDescription("The command to disable.").setRequired(true)))
        .addSubcommand((options) => options.setName("enable").setDescription("Enable a command.").addStringOption((option) => option.setName("enable-command").setDescription("The command to enable.").setRequired(true)))
    .addSubcommand((options) => options.setName("list").setDescription("List all disabled commands."))
        .addSubcommand((options) => options.setName("enable-channel").setDescription("Enable a channel.").addChannelOption((option) => option.setName("enable-channel").setDescription("The channel to enable.").setRequired(true)))
        .addSubcommand((options) => options.setName("disable-channel").setDescription("Disable a channel.").addChannelOption((option) => option.setName("disable-channel").setDescription("The channel to disable.").setRequired(true)))
    , {
      guildIds: getTestGuilds(),
      registerCommandIfMissing: environment.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: ["974034185561985076"],
    });
  }
}
