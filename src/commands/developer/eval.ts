import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, RegisterBehavior, ChatInputCommand, ApplicationCommandRegistry } from "@sapphire/framework";
import { CommandInteraction, Message } from "discord.js";
import { ENV } from "../../config";
import { Stopwatch } from "@sapphire/stopwatch";
import { inspect } from "node:util";
import { Type } from "@sapphire/type";
import { isThenable } from "@sapphire/utilities";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { BrandingColors } from "../../lib/utils/colors";
import { codeBlock } from "../../lib/utils/format";
import { createEmbed } from "../../lib/utils/responses";
import { seconds } from "../../lib/utils/time";

@ApplyOptions<ICommandOptions>({
  description: "Evaluates arbitrary JavaScript code.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "<some code>",
    command_type: "slash",
    examples: ["eval this.container.client.ws.ping"],
  },
  chatInputCommand: {
    register: ENV.bot.register_commands,
    guildIds: [ENV.bot.test_guild_id],
    behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
    idHints: ["964166784661983232"],
  },
  preconditions: ["OwnerOnly"],
})
export class UserCommand extends ICommand {
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const code = interaction.options.getString("code", true);
    const depth = interaction.options.getInteger("depth");
    const isAsync = interaction.options.getBoolean("async");
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    await interaction.deferReply({ ephemeral });

    const { result, success, type, elapsed } = await this.eval(interaction, code, { isAsync, depth });
    const output = success ? codeBlock("js", result) : codeBlock("bash", result);

    const embedLimitReached = output.length > 4096;
    const embed = createEmbed(
      embedLimitReached ? "Output was too long! The result has been sent as a file." : output,
      success ? BrandingColors.Primary : BrandingColors.Error
    ).setTimestamp();

    embed
      .setTitle(success ? "Eval Result ✨" : "Eval Error 💀")
      .addField("Type 📝", codeBlock("ts", type), true)
      .addField("Elapsed ⏱", elapsed, true);

    const files = embedLimitReached ? [{ attachment: Buffer.from(output), name: "output.txt" }] : [];
    return interaction.editReply({ embeds: [embed], files });
  }

  private async eval(
    interaction: CommandInteraction,
    code: string,
    { isAsync, depth }: { isAsync: boolean | null; depth: number | null }
  ) {
    if (isAsync) {
      code = `(async () => {\n${code}\n})();`;
    }

    let success = true;
    let result;

    const stopwatch = new Stopwatch();
    let elapsed = "";

    try {
      // This will serve as an alias for ease of use in the eval code
      const i = interaction;

      // eslint-disable-next-line no-eval
      result = eval(code);
      elapsed = stopwatch.toString();

      if (isThenable(result)) {
        stopwatch.restart();
        result = await result;
        elapsed = stopwatch.toString();
      }
    } catch (error) {
      if (!elapsed) {
        elapsed = stopwatch.toString();
      }

      result = (error as Error).message ?? error;
      success = false;
    }

    stopwatch.stop();

    const type = new Type(result).toString();

    if (typeof result !== "string") {
      result = inspect(result, { depth });
    }

    return { result, success, type, elapsed };
  }
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((builder) =>
            builder //
              .setName("code")
              .setDescription("The code to evaluate")
              .setRequired(true)
          )
          .addBooleanOption((builder) =>
            builder
              .setName("async")
              .setDescription("Whether to allow use of async/await. If set, the result will have to be returned")
              .setRequired(false)
          )
          .addBooleanOption((builder) =>
            builder //
              .setName("ephemeral")
              .setDescription("Whether to show the result ephemerally")
              .setRequired(false)
          )
          .addIntegerOption((builder) =>
            builder //
              .setName("depth")
              .setDescription("The depth of the displayed return type")
              .setRequired(false)
          ),
      {
        guildIds: [ENV.bot.test_guild_id],
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["964166784661983232"],
      }
    );
  }
}
