import { Precondition } from "@sapphire/framework";
import { Message, CommandInteraction, CacheType } from "discord.js";
import { ENV } from "../config";

const dev_user: string[] = [
  ENV.developer.discord_id,
  // add more options here
];

export class UserPrecondition extends Precondition {
  public override async messageRun(ctx: Message) {
    return dev_user.includes(ctx.author.id)
      ? this.ok()
      : this.error({
          message:
            "This command is currently in active development. Please try again later or join our support server for questions.",
        });
  }

  public override async chatInputRun(interaction: CommandInteraction<CacheType>) {
    return dev_user.includes(interaction.user.id)
      ? this.ok()
      : this.error({
          message:
            "This command is currently in active development. Please try again later or join our support server for questions.",
        });
  }
}
