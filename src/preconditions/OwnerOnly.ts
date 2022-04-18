import { Precondition } from "@sapphire/framework";
import { CommandInteraction, Message } from "discord.js";

export class UserPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {
    //  if (!this.container.client.application!.owner) {
    //     await this.container.client.application!.fetch();
    //  }

    //  // `application.owner` is guaranteed to be populated after the above fetch.
    //  const owner = this.container.client.application!.owner!;

    //  // It will be a (partial) user or a team, and if it's a team, we should allow
    //  // access to every member.
    //  return (owner instanceof Team ? owner.members.has(interaction.user.id) : interaction.user.id === owner.id)
    //     ? this.ok()
    //     : this.error({
    //          message: "This command can only be used by the bot developers.",
    //       });

    if (!this.container.client.BotDevelopers.has(interaction.user.id)) {
      return this.error({
        message: "This command can only be used by the bot developers.",
      });
    } else {
      return this.ok();
    }
  }

  public override async messageRun(ctx: Message) {
    //     if (!this.container.client.application!.owner) {
    //        await this.container.client.application!.fetch();
    //     }

    //     // `application.owner` is guaranteed to be populated after the above fetch.
    //     const owner = this.container.client.application!.owner!;

    //     // It will be a (partial) user or a team, and if it's a team, we should allow
    //     // access to every member.
    //     return (owner instanceof Team ? owner.members.has(ctx.author.id) : ctx.author.id === owner.id)
    //        ? this.ok()
    //        : this.error({
    //             message: "This command can only be used by the bot developers.",
    //          });
    //  }
    if (!this.container.client.BotDevelopers.has(ctx.author.id)) {
      return this.error({
        message: "This command can only be used by the bot developers.",
      });
    } else {
      return this.ok();
    }
  }
}
