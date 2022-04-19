import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { TextChannel } from "discord.js";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { BaseEmbed } from "../../lib/utils/embed";
import { seconds } from "../../lib/utils/time";

@ApplyOptions<ICommandOptions>({
  description: "Configure bot settings",
  cooldownDelay: seconds(15),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "[option] <value>",
    examples: ["configure language Spanish"],
  },
  preconditions: ["development"],
  requiredUserPermissions: ["ADMINISTRATOR"],
})
export class UserCommand extends ICommand {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    if (!interaction.guild) return;

    // Access the sub commands
    switch (interaction.options.getSubcommand()) {
      case "language":
        // fetches the language option we want
        const result = interaction.options.getString("language");

        if (!result)
          return interaction.reply({
            content: await this.translate(
              interaction.channel as TextChannel,
              "commands/configuration:language.error_reply"
            ),
            ephemeral: true,
          });

        await interaction.reply({
          embeds: [
            new BaseEmbed().interactionEmbed(
              {
                description: "loading...",
              },
              interaction
            ),
          ],
        });

        // Fetch the old data from the cache or db and update it

        const fetchOldCache = await this.container.client.GuildSettingsModel.getDocument(interaction.guild);

        if (fetchOldCache) {
          this.container.client.GuildSettingsModel._cache.set(interaction.guild.id, {
            _id: interaction.guild.id,
            guild_name: interaction.guild.name,
            language: result,
            blacklisted: fetchOldCache.blacklisted ?? false,
            data: fetchOldCache?.data ?? {},
          });
        }

        // After updating the cache we will send the results to the database

        await this.container.client.GuildSettingsModel._model.findByIdAndUpdate(
          { _id: interaction.guildId },
          {
            $set: {
              guild_name: interaction.guild.name,
              language: result,
            },
          }
        );

        return await interaction.reply({
          embeds: [
            new BaseEmbed().interactionEmbed(
              {
                description: await this.translate(
                  interaction.channel as TextChannel,
                  "commands/configuration:language.success_reply",
                  {
                    lang: result,
                  }
                ),
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
              .setName("language")
              .setDescription("Sets the active language the bot will use.")
              .addStringOption((stringOption) =>
                stringOption
                .setName("select")
                .setDescription("Select the language you want to use.")
                  .addChoices([
                    ["English", "en-US"],
                    ["Espanol", "en-ES"],
                  ])
                  .setRequired(true)
              )
          ),
      {
        guildIds: [ENV.bot.test_guild_id],
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["966111289652969532"],
      }
    );
  }
}
