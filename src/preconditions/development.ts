import { Precondition } from "@sapphire/framework";
import { Message, CommandInteraction, CacheType } from "discord.js";

export class UserPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction<CacheType>) {
    return this.container.client.BotDevelopers.has(interaction.user.id)
      ? this.ok()
      : this.error({
          message:
            "This command is currently in active development. Please try again later or join our support server for questions.",
        });
  }

  public override async messageRun(ctx: Message) {
    return this.container.client.BotDevelopers.has(ctx.author.id)
      ? this.ok()
      : this.error({
          message:
            "This command is currently in active development. Please try again later or join our support server for questions.",
        });
  }
}
