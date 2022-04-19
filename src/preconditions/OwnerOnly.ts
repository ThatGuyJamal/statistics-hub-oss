import { Precondition } from "@sapphire/framework";
import { CommandInteraction, Message } from "discord.js";

export class UserPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!this.container.client.BotDevelopers.has(interaction.user.id)) {
      return this.error({
        message: "This command can only be used by the bot developers.",
      });
    } else {
      return this.ok();
    }
  }

  public override async messageRun(ctx: Message) {
    if (!this.container.client.BotDevelopers.has(ctx.author.id)) {
      return this.error({
        message: "This command can only be used by the bot developers.",
      });
    } else {
      return this.ok();
    }
  }
}
