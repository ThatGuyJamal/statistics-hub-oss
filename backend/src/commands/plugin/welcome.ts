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

import { ApplyOptions } from "@sapphire/decorators";
import {
  BucketScope,
  ApplicationCommandRegistry,
  RegisterBehavior,
  ChatInputCommand,
  Events,
} from "@sapphire/framework";
import { GuildMember } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { WelcomePluginMongoModel } from "../../database/models/plugins/welcome/welcome";
import stripIndent, {
  channelMention,
  codeBlock,
  hideLinkEmbed,
  memberMention,
} from "../../internal/functions/formatting";
import { pauseThread } from "../../internal/functions/promises";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";
import { BaseEmbed } from "../../internal/structures/Embed";

const DEFAULT_CARD_URL = "https://i.imgur.com/dCS4tQk.jpeg";

@ApplyOptions<ICommandOptions>({
  name: "welcome",
  description: "Configure the welcome plugin",
  cooldownDelay: seconds(20),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "welcome [command] <arguments | or non>",
    examples: ["welcome setup <welcome channel> <welcome message>"],
    command_type: "slash",
    subcommands: ["delete", "enable", "disable", "setup", "simulate", "update", "view"],
  },
  requiredClientPermissions: ["ATTACH_FILES"],
})
export class UserCommand extends ICommand {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const { client } = this.container;
    if (!interaction.guild) return;

    if (interaction.options.getSubcommand() === "setup") {
      await interaction.deferReply({
        ephemeral: true,
      });

      const themeOptions = interaction.options.getString("theme-type", true);
      const welcomeChannel = interaction.options.getChannel("welcome-channel", true);
      const goodbyeChannel = interaction.options.getChannel("goodbye-channel", false);
      let welcomeMessage = interaction.options.getString("welcome-message", false);
      const welcomePingOnJoin = interaction.options.getBoolean("welcome-ping-on-join", false);
      let CardURl = interaction.options.getString("card-url", false);

      if (!welcomeMessage) welcomeMessage = "Welcome to the server, {{user.mention}}!";

      let goodbyeMessage = interaction.options.getString("goodbye-message", false);

      if (!goodbyeMessage) goodbyeMessage = "Goodbye, {{user.mention}}!";

      const document = await WelcomePluginMongoModel.findOne({ GuildId: interaction.guildId });
      const cachedData = client.LocalCacheStore.memory.plugins.welcome.get(interaction.guild);

      // If no document found, we create a new one.
      if (!document) {
        await interaction.channel?.send({
          content: `Thanks for running the setup! Here are a few tips:`,
          embeds: [
            new BaseEmbed({}).interactionEmbed(
              {
                description: codeBlock(
                  "css",
                  `
              === Formatting ===
              You can use the shortcuts below to format your message and meta data within it.

              All command shortcuts are case-sensitive and need to be wrapped in "{{" and "}}" brackets.

              Example: "{{user.mention}}" will be replaced with ${memberMention(interaction.user.id)}.

              === Available shortcuts ===
              [user.mention] - Mentions the user that triggered the command.
              [user.username] - Replaces with the user's username.
              [user.id] - Replaces with the user's ID.
              [user.tag] - Replaces with the user's tag.
              [user.createdAt] - Replaces with the user's creation date.
              [server.memberCount] - Replaces with the server's member count.
              [server.name] - Replaces with the server's name.
              [server.id] - Replaces with the server's ID.
              `
                ),
              },
              interaction
            ),
          ],
        });

        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          GuildId: interaction.guild.id,
          GuildName: interaction.guild.name,
          GuildOwnerId: interaction.guild.ownerId,
          Enabled: true,
          GuildWelcomeTheme: themeOptions,
          GuildWelcomeChannelId: welcomeChannel?.id,
          GuildWelcomeMessage: welcomeMessage,
          GuildGoodbyeChannelId: goodbyeChannel?.id ?? undefined,
          GuildGoodbyeMessage: goodbyeMessage,
          GuildWelcomeEmbed: {},
          GuildWelcomePingOnJoin: welcomePingOnJoin ?? false,
          GuildWelcomeThemeUrl: CardURl ?? DEFAULT_CARD_URL,
          CreatedById: interaction.user.id,
          CreatedAt: new Date(),
        });

        await WelcomePluginMongoModel.create({
          GuildId: interaction.guild.id,
          GuildName: interaction.guild.name,
          GuildOwnerId: interaction.guild.ownerId,
          Enabled: true,
          GuildWelcomeTheme: themeOptions,
          GuildWelcomeChannelId: welcomeChannel?.id,
          GuildWelcomeMessage: welcomeMessage,
          GuildGoodbyeChannelId: goodbyeChannel?.id ?? undefined,
          GuildGoodbyeMessage: goodbyeMessage,
          GuildWelcomeEmbed: {},
          GuildWelcomePingOnJoin: welcomePingOnJoin ?? false,
          GuildWelcomeThemeUrl: CardURl ?? DEFAULT_CARD_URL,
          CreatedById: interaction.user.id,
          CreatedAt: new Date(),
        }).then((res) => client.logger.info(res));
      }
      // If a document is found, we update it.
      else {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...cachedData,
          GuildId: interaction.guild.id,
          GuildName: interaction.guild?.name,
          GuildOwnerId: interaction.guild?.ownerId,
          Enabled: true ?? cachedData?.Enabled ?? false,
          GuildWelcomeChannelId: welcomeChannel?.id ?? cachedData?.GuildWelcomeChannelId ?? undefined,
          GuildGoodbyeChannelId: goodbyeChannel?.id ?? cachedData?.GuildGoodbyeChannelId ?? undefined,
          GuildWelcomeMessage: welcomeMessage ?? cachedData?.GuildWelcomeMessage ?? undefined,
          GuildGoodbyeMessage: goodbyeMessage ?? cachedData?.GuildGoodbyeMessage ?? undefined,
          GuildWelcomeTheme: themeOptions ?? cachedData?.GuildWelcomeTheme ?? undefined,
          GuildWelcomePingOnJoin: welcomePingOnJoin ?? cachedData?.GuildWelcomePingOnJoin ?? false,
          GuildWelcomeThemeUrl: CardURl ?? cachedData?.GuildWelcomeThemeUrl ?? DEFAULT_CARD_URL,
          CreatedById: interaction.user.id,
          CreatedAt: new Date(),
        });
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildId: interaction.guild.id,
              GuildName: interaction.guild?.name,
              GuildOwnerId: interaction.guild?.ownerId,
              Enabled: true,
              GuildWelcomeChannelId: welcomeChannel?.id ?? null,
              GuildGoodbyeChannelId: goodbyeChannel?.id ?? null,
              GuildWelcomeMessage: welcomeMessage,
              GuildGoodbyeMessage: goodbyeMessage,
              GuildWelcomeTheme: themeOptions,
              GuildWelcomePingOnJoin: welcomePingOnJoin ?? false,
              GuildWelcomeThemeUrl: CardURl ?? DEFAULT_CARD_URL,
              CreatedById: interaction.user.id,
              CreatedAt: new Date(),
            },
          }
        ).then((res) => client.logger.info(res));
      }
      return await interaction.editReply({
        content: "Welcome plugin setup complete! You can view your settings with `welcome view`",
      });
    } else if (interaction.options.getSubcommand() === "disable") {
      // When the command is disabled, we will clear up some cache. but it will not delete the document from the database.
      client.LocalCacheStore.memory.plugins.welcome.delete(interaction.guild!);
      // Next we will simply disable the document from the db.
      await WelcomePluginMongoModel.findOneAndUpdate(
        { GuildId: interaction.guildId },
        {
          $set: {
            Enabled: false,
          },
        }
      ).then((res) => {
        if (!res) {
          return interaction.reply({
            content: "You dont have a welcome plugin setup, so I can't disable it.",
            ephemeral: true,
          });
        } else {
          client.logger.info(res);
          return interaction.reply({
            content: "Welcome plugin disabled successfully!",
            ephemeral: true,
          });
        }
      });
    } else if (interaction.options.getSubcommand() === "enable") {
      await WelcomePluginMongoModel.findOneAndUpdate(
        { GuildId: interaction.guild.id },
        {
          $set: {
            Enabled: true,
          },
        }
      )
        .then((res) => {
          if (!res) {
            return interaction.reply({
              content: "Welcome plugin is not setup! Please use `welcome setup` to setup the plugin.",
              ephemeral: true,
            });
          }
          client.logger.info(res);
          client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
            GuildId: res!.GuildId,
            GuildName: res!.GuildName ?? undefined,
            GuildOwnerId: res!.GuildOwnerId ?? undefined,
            Enabled: true,
            CreatedAt: res!.CreatedAt ?? new Date(),
            GuildWelcomeChannelId: res!.GuildWelcomeChannelId ?? undefined,
            GuildGoodbyeChannelId: res!.GuildGoodbyeChannelId ?? undefined,
            GuildWelcomeMessage: res!.GuildWelcomeMessage ?? undefined,
            GuildGoodbyeMessage: res!.GuildGoodbyeMessage ?? undefined,
            GuildWelcomeTheme: res!.GuildWelcomeTheme ?? undefined,
            GuildWelcomePingOnJoin: res.GuildWelcomePingOnJoin || false,
            GuildWelcomeThemeUrl: res.GuildWelcomeThemeUrl ?? DEFAULT_CARD_URL,
            CreatedById: interaction.user.id,
          });
          return interaction.reply({
            content: "Welcome plugin enabled!",
            ephemeral: true,
          });
        })
        .catch((err) => client.logger.error(err));
    } else if (interaction.options.getSubcommand() === "delete") {
      client.LocalCacheStore.memory.plugins.welcome.delete(interaction.guild);
      await WelcomePluginMongoModel.deleteOne({ GuildId: interaction.guild.id }).then((res) => client.logger.info(res));
      return await interaction.reply({
        content: `Welcome plugin deleted successfully from ${interaction.guild.name}!`,
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "simulate") {
      let checkIfData = client.LocalCacheStore.memory.plugins.welcome.get(interaction.guild!);
      const missingPerms: string[] = [];

      if (!checkIfData || !checkIfData.Enabled) {
        return await interaction.reply({
          content: "Please enable the welcome plugin first!",
          ephemeral: true,
        });
      }

      await interaction.reply({
        embeds: [
          new BaseEmbed().interactionEmbed(
            {
              description: "Running welcome plugin simulation...",
            },
            interaction
          ),
        ],
        ephemeral: true,
      });

      if (!checkIfData.GuildWelcomeChannelId) {
        client.logger.debug("[WelcomePlugin] Simulation was ran but no greet channel was found.");
        await interaction.editReply({
          content: "No welcome channel setup skipping...",
        });
      } else {
        const channel = interaction.guild.channels.cache.get(checkIfData.GuildWelcomeChannelId);
        // Check if we have permissions to send messages in the channel.
        if (!channel || !channel.permissionsFor(interaction.guild.me!)?.has("SEND_MESSAGES")) {
          client.logger.debug("[WelcomePlugin] Simulation was ran but no permissions to send messages in the channel.");
          missingPerms.push(checkIfData.GuildWelcomeChannelId);
        }
        this.container.client.emit(Events.GuildMemberAdd, interaction.member as GuildMember);
      }

      if (!checkIfData.GuildGoodbyeChannelId) {
        client.logger.debug("[WelcomePlugin] Simulation was ran but no goodbye channel was found.");
        await interaction.editReply({
          content: "No goodbye channel setup skipping...",
        });
      } else {
        const channel = interaction.guild.channels.cache.get(checkIfData.GuildGoodbyeChannelId);
        // Check if we have permissions to send messages in the channel.
        if (!channel || !channel.permissionsFor(interaction.guild.me!)?.has("SEND_MESSAGES")) {
          client.logger.debug("[WelcomePlugin] Simulation was ran but no permissions to send messages in the channel.");
          missingPerms.push(checkIfData.GuildGoodbyeChannelId);
        }
        this.container.client.emit(Events.GuildMemberRemove, interaction.member as GuildMember);
      }

       await interaction.editReply({
        embeds: [
          new BaseEmbed().interactionEmbed(
            {
              description: `Simulation complete!`,
              fields: [
                {
                  name: "Welcome Channel",
                  value: `${channelMention(checkIfData.GuildWelcomeChannelId!)}`,
                },
                {
                  name: "Goodbye Channel",
                  value: `${channelMention(checkIfData.GuildGoodbyeChannelId!)}`,
                },
              ],
            },
            interaction
          ),
        ],
      });

      if (missingPerms.length > 0) {
        return await interaction.followUp({
          content: `Warning! Im missing permissions to send messages in the following channels: ${missingPerms.map((c) => `${channelMention(c)
            }`).join(", ")}. So the simulation message was not sent...`,
          ephemeral: true,
        })
      }
    } else if (interaction.options.getSubcommand() === "update") {
      await interaction.deferReply({
        ephemeral: true,
      });

      // arguments
      let newGreetMessage = interaction.options.getString("greet-message");
      let newGoodbyeMessage = interaction.options.getString("goodbye-message");
      let newTheme = interaction.options.getString("theme");
      let newWelcomeChannel = interaction.options.getChannel("welcome-channel");
      let newGoodbyeChannel = interaction.options.getChannel("goodbye-channel");
      let welcomePingOnJoin = interaction.options.getBoolean("welcome-ping-on-join");
      let cardBackground = interaction.options.getString("card-background");
      let cardPreBuiltBackground = interaction.options.getString("pre-built-background");
      let deleteOption = interaction.options.getString("update-delete");

      if (
        !newGreetMessage &&
        !newGoodbyeMessage &&
        !newTheme &&
        !newWelcomeChannel &&
        !newGoodbyeChannel &&
        welcomePingOnJoin === null &&
        !cardBackground &&
        !cardPreBuiltBackground &&
        !deleteOption
      ) {
        return await interaction.editReply({
          content: "You did not select update any options! Please try again...",
        });
      }

      let document = await WelcomePluginMongoModel.findOne({ GuildId: interaction.guild.id });
      let oldData = client.LocalCacheStore.memory.plugins.welcome.get(interaction.guild!);

      if (!document || !document.Enabled || !oldData || !oldData.Enabled) {
        return await interaction.editReply(
          "You have no welcome plugin data or the plugin is disabled. Please use `welcome setup` to setup the plugin. You can also view your current settings with the `welcome view` command."
        );
      }

      // check if Card URL is valid
      if (cardBackground) {
        if (!cardBackground.startsWith("https://")) {
          return await interaction.editReply({
            content: `Card URL you entered is not valid! Please use a valid URL using \`https://\`. 
              Make sure the link to the background is public. If you have a picture you want to use, try uploading it to ${hideLinkEmbed(
                "https://imgur.com/"
              )}\n Example: https://i.imgur.com/az1Sx59.jpeg`,
          });
        }
      }

      let settingsChanged = [];

      // Update the data in the cache
      if (oldData) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          GuildId: oldData.GuildId,
          GuildName: oldData.GuildName ?? undefined,
          GuildOwnerId: oldData.GuildOwnerId ?? undefined,
          Enabled: oldData.Enabled ?? true,
          CreatedAt: oldData.CreatedAt ?? new Date(),
          GuildWelcomeChannelId: oldData.GuildWelcomeChannelId ?? undefined,
          GuildGoodbyeChannelId: oldData.GuildGoodbyeChannelId ?? undefined,
          GuildWelcomeMessage: newGreetMessage ?? oldData.GuildWelcomeMessage,
          GuildGoodbyeMessage: newGoodbyeMessage ?? oldData.GuildGoodbyeMessage,
          GuildWelcomeTheme: newTheme ?? oldData.GuildWelcomeTheme,
          GuildWelcomePingOnJoin: welcomePingOnJoin ?? oldData.GuildWelcomePingOnJoin,
          GuildWelcomeThemeUrl: cardBackground
            ? cardBackground
            : cardPreBuiltBackground
            ? cardPreBuiltBackground
            : DEFAULT_CARD_URL,
          CreatedById: oldData.CreatedById ?? undefined,
        });
      } else {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          GuildId: interaction.guild.id,
          GuildName: interaction.guild.name,
          GuildOwnerId: interaction.guild.ownerId,
          Enabled: true,
          GuildWelcomeEmbed: {},
          GuildWelcomePingOnJoin: welcomePingOnJoin ?? false,
          GuildWelcomeThemeUrl: DEFAULT_CARD_URL,
          CreatedById: interaction.user.id,
          CreatedAt: new Date(),
        });
      }

      // Update the data in the database
      if (newWelcomeChannel) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...oldData,
          GuildWelcomeChannelId: newWelcomeChannel.id,
        });
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildWelcomeChannelId: newWelcomeChannel.id,
            },
          }
        ).then((res) => client.logger.info(res));
        settingsChanged.push("welcome channel");
      }

      if (newGoodbyeChannel) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...oldData,
          GuildGoodbyeChannelId: newGoodbyeChannel.id,
        });
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildGoodbyeChannelId: newGoodbyeChannel.id,
            },
          }
        ).then((res) => client.logger.info(res));
        settingsChanged.push("goodbye channel");
      }

      if (newGreetMessage) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...oldData,
          GuildWelcomeMessage: newGreetMessage,
        });
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildWelcomeMessage: newGreetMessage,
            },
          }
        ).then((res) => client.logger.info(res));
        settingsChanged.push("welcome message");
      }

      if (newGoodbyeMessage) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...oldData,
          GuildGoodbyeMessage: newGoodbyeMessage,
        });
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildGoodbyeMessage: newGoodbyeMessage,
            },
          }
        ).then((res) => client.logger.info(res));
        settingsChanged.push("goodbye message");
      }

      if (newTheme) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...oldData,
          GuildWelcomeTheme: newTheme,
        });
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildWelcomeTheme: newTheme,
            },
          }
        ).then((res) => client.logger.info(res));
        settingsChanged.push("theme");
      }

      if (welcomePingOnJoin) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...oldData,
          GuildWelcomePingOnJoin: welcomePingOnJoin,
        });
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildWelcomePingOnJoin: welcomePingOnJoin,
            },
          }
        ).then((res) => client.logger.info(res));
        settingsChanged.push("welcome ping on join");
      }

      if (cardPreBuiltBackground) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...oldData,
          GuildWelcomeThemeUrl: cardPreBuiltBackground ?? DEFAULT_CARD_URL,
        });
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildWelcomeThemeUrl: cardPreBuiltBackground ?? DEFAULT_CARD_URL,
            },
          }
        ).then((res) => client.logger.info(res));
        settingsChanged.push("theme url (prebuilt)");
      }

      if (cardBackground) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...oldData,
          GuildWelcomeThemeUrl: cardBackground ?? DEFAULT_CARD_URL,
        });
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildWelcomeThemeUrl: cardBackground ?? DEFAULT_CARD_URL,
            },
          }
        ).then((res) => client.logger.info(res));
        settingsChanged.push("theme url");
      }

      if (deleteOption) {
        client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
          ...oldData,
          [deleteOption]: undefined,
        });
        if (deleteOption === "GuildWelcomeThemeUrl") {
          await WelcomePluginMongoModel.updateOne(
            { GuildId: interaction.guildId },
            {
              $set: {
                [deleteOption]: DEFAULT_CARD_URL,
              },
            }
          ).then((res) => client.logger.info(res));
        } else {
          await WelcomePluginMongoModel.updateOne(
            { GuildId: interaction.guildId },
            {
              $set: {
                [deleteOption]: null,
              },
            }
          ).then((res) => client.logger.info(res));
        }
        settingsChanged.push("deleted option");
      }

      return await interaction.editReply({
        content: `Successfully updated the following settings: \n${settingsChanged
          .map((setting) => `\`${setting}\``)
          .join(", ")}\n Run \`welcome view\` to see your changes or \`welcome simulate\` to test them.`,
      });
    } else if (interaction.options.getSubcommand() === "view") {
      await interaction.deferReply({
        ephemeral: true,
      });

      // let getData = await WelcomePluginMongoModel.findOne({ GuildId: interaction.guildId });
      let getData = await client.LocalCacheStore.memory.plugins.welcome.get(interaction.guild!);

      if (!getData) {
        return await interaction.editReply({
          content: "You have no welcome plugin data to view... Please use `welcome setup` to setup the plugin.",
        });
      }

      return await interaction.editReply({
        embeds: [
          new BaseEmbed().interactionEmbed(
            {
              description: stripIndent(`
              === Welcome Plugin Configuration ===

              Status = ${getData.Enabled ? "Enabled" : "Disabled"}
              Welcome Channel = ${channelMention(getData.GuildWelcomeChannelId!)}
              Goodbye Channel = ${channelMention(getData.GuildGoodbyeChannelId!)}
              Greet Message = \`${getData.GuildWelcomeMessage}\`
              Goodbye Message = \`${getData.GuildGoodbyeMessage}\`
              Theme = __${getData.GuildWelcomeTheme}__
              Ping on join = ${getData.GuildWelcomePingOnJoin ? "Enabled" : "Disabled"}
              Theme URL = \`${getData.GuildWelcomeThemeUrl ?? DEFAULT_CARD_URL}\`
              Created By = __${memberMention(getData.CreatedById!) || "Unknown"}__
              Last Updated At = \`${getData.CreatedAt.toLocaleDateString()} at ${getData.CreatedAt.toLocaleTimeString()}\`
              `),
            },
            interaction
          ),
        ],
      });
    }
  }
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addSubcommand((options) =>
            options
              /**
               * ! setup command data
               */
              .setName("setup")
              .setDescription("Setup the welcome system.")
              .addStringOption((options) =>
                options
                  .setName("theme-type")
                  .setDescription("The type of theme you wish to use for the welcome plugin.")
                  .setRequired(true)
                  .addChoices([
                    ["Card", "card"],
                    ["Text", "text"],
                    // ["Embed", "embed"],
                  ])
              )
              .addChannelOption((options) =>
                options.setName("welcome-channel").setDescription("The welcome channel.").setRequired(true)
              )
              .addChannelOption((options) =>
                options.setName("goodbye-channel").setDescription("The good-bye channel.").setRequired(false)
              )
              .addStringOption((options) =>
                options
                  .setName("welcome-message")
                  .setDescription("The message to send in the welcome.")
                  .setRequired(false)
              )
              .addStringOption((options) =>
                options
                  .setName("goodbye-message")
                  .setDescription("The message to send in the goodbye.")
                  .setRequired(false)
              )
              .addStringOption((options) =>
                options.setName("card-url").setDescription("The url for the card theme.").setRequired(false)
              )
              .addBooleanOption((options) =>
                options.setName("ping-on-join").setDescription("Ping the user when they join.").setRequired(false)
              )
          )
          .addSubcommand((options) => options.setName("simulate").setDescription("Simulate a member join and leave."))
          .addSubcommand((options) => options.setName("enable").setDescription("Enable the welcome system."))
          .addSubcommand((options) => options.setName("disable").setDescription("Disable the welcome system."))
          .addSubcommand((options) =>
            options
              .setName("update")
              .setDescription("Update a value in the welcome system.")
              .addStringOption((options) =>
                options.setName("greet-message").setDescription("The new welcome message.").setRequired(false)
              )
              .addStringOption((options) =>
                options.setName("goodbye-message").setDescription("The new goodbye message.").setRequired(false)
              )
              .addStringOption((options) =>
                options
                  .setName("theme")
                  .setDescription("The new theme.")
                  .setRequired(false)
                  .addChoices([
                    ["Card", "card"],
                    ["Text", "text"],
                    // ["Embed", "embed"],
                  ])
              )
              .addChannelOption((options) =>
                options.setName("welcome-channel").setDescription("The new welcome channel.").setRequired(false)
              )
              .addChannelOption((options) =>
                options.setName("goodbye-channel").setDescription("The new goodbye channel.").setRequired(false)
              )
              .addStringOption((options) =>
                options.setName("card-background").setDescription("The url for the card theme.").setRequired(false)
              )
              .addStringOption((options) =>
                options
                  .setName("pre-built-background")
                  .setDescription("Pre-built backgrounds for the welcome/goodbye card.")
                  .addChoices([
                    ["Sunset forest Banner", "https://i.imgur.com/ea9PB3H.png"],
                    ["Green Railroad", "https://i.imgur.com/dCS4tQk.jpeg"],
                    ["Rain Drops", "https://i.imgur.com/ftY0903.jpeg"],
                    [
                      "Hidden Lighthouse",
                      "https://cdn.discordapp.com/attachments/937124004492365874/968196852056997938/EpicBanner.png",
                    ],
                    [
                      "Warm sunset",
                      "https://cdn.discordapp.com/attachments/937124004492365874/972560334965579886/Banner2.png",
                    ],
                  ])
                  .setRequired(false)
              )
              .addBooleanOption((options) =>
                options
                  .setName("welcome-ping-on-join")
                  .setDescription("Ping the user when they join.")
                  .setRequired(false)
              )
              .addStringOption((options) =>
                options
                  .setName("update-delete")
                  .setDescription("Delete a value in the welcome system.")
                  .addChoices([
                    ["Greet Message", "GuildWelcomeMessage"],
                    ["Goodbye Message", "GuildGoodbyeMessage"],
                    ["Theme", "GuildWelcomeTheme"],
                    ["Theme URL", "GuildWelcomeThemeUrl"],
                    ["Ping on join", "GuildWelcomePingOnJoin"],
                    ["Welcome Channel", "GuildWelcomeChannelId"],
                    ["Goodbye Channel", "GuildGoodbyeChannelId"],
                  ])
                  .setRequired(false)
              )
          )
          .addSubcommand((options) => options.setName("delete").setDescription("Delete the welcome system."))
          .addSubcommand((options) => options.setName("view").setDescription("View the welcome systems settings.")),
      {
        guildIds: environment.bot.register_global_commands ? undefined : getTestGuilds(),
        registerCommandIfMissing: environment.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["973652318224535633"],
      }
    );
  }
}
