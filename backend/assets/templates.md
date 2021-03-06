    <!-- Statistics Hub OSS - A data analytics discord bot.

    Copyright (C) 2022, ThatGuyJamal and contributors

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details. -->

## Commands

```ts
import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";

@ApplyOptions<ICommandOptions>({
  description: "",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 1,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "",
    examples: [""],
    command_type: "",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {}
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {}
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: getTestGuilds(),
      registerCommandIfMissing: environment.bot.register_commands,
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
import { CommandInteraction, Message } from "discord.js";
import { Precondition } from "@sapphire/framework";

export class UserPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {}

  public override async messageRun(ctx: Message) {}
}
```
