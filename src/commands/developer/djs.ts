import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { ENV } from "../../config";
import Docs from "discord.js-docs";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { seconds } from "../../lib/utils/time";

@ApplyOptions<ICommandOptions>({
  description: "Read the discord.js documentation.",
  cooldownDelay: seconds(11),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "djs [query]",
    examples: ["djs Interaction", "djs ClientOptions"],
    command_type: "slash",
  },
  chatInputCommand: {
    register: ENV.bot.register_commands,
    guildIds: [ENV.bot.test_guild_id],
    behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
  },
  preconditions: ["OwnerOnly"],
})
export class UserCommand extends ICommand {
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const branch = "stable";

    const userQuery = interaction.options.getString("query", true);

    const doc = await Docs.fetch(branch, {
      force: true,
    });

    const result = doc.resolveEmbed(userQuery);

    if (!result) {
      return interaction.reply({
        content: `No results found for \`${userQuery}\`! Try again...`,
      });
    }

    const replaceDisco = (str: string) =>
      str.replace(/docs\/docs\/disco/g, `docs/discord.js/${branch}`).replace(/ \(disco\)/g, "");

    const string = replaceDisco(JSON.stringify(result));

    const embed = JSON.parse(string);

    embed.author.url = `https://discord.js.org/#/docs/discord.js/${branch}/general/welcome`;

    const extra =
      "\n\nView more here: " +
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        .exec(embed.description)![0]
        .split(")")[0];

    const max = 1024;

    for (const field of embed.fields || []) {
      if (field.value.length >= max) {
        field.value = field.value.slice(0, max);
        const split = field.value.split(" ");
        let joined = split.join(" ");

        while (joined.length >= max - extra.length) {
          split.pop();
          joined = split.join(" ");
        }

        field.value = joined + extra;
      }
    }

    if (embed.fields && embed.fields[embed.fields.length - 1].value.startsWith("[View source")) {
      embed.fields.pop();
    }

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((s) => {
            return s
              .setName("query")
              .setRequired(true)
              .setDescription("The query to search for from the discord.js documentation.");
          }),
      {
        guildIds: [ENV.bot.test_guild_id],
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["964542816921460906"],
      }
    );
  }
}
