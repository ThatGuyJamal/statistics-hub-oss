## Commands

```ts
import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { Message } from "discord.js";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { seconds } from "../../lib/utils/time";

@ApplyOptions<ICommandOptions>({
  description: "",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "",
    examples: [""],
  },
})
export class UserCommand extends ICommand {
  // Message Based Command
  public async messageRun(ctx: Message) {}
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {}
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: [ENV.bot.test_guild_id],
      registerCommandIfMissing: ENV.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: [],
    });
  }
}
```

## Events

```ts
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
  event: Events,
})
export class UserEvent extends Listener {
  public async run(): Promise<void> {}
}
```

## Preconditions

```ts
import { CommandInteraction, Message, Team } from "discord.js";
import { Precondition } from "@sapphire/framework";

export class UserPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {}

  public override async messageRun(ctx: Message) {}
}
```
