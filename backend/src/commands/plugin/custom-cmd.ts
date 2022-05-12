import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";

@ApplyOptions<ICommandOptions>({
    name: "customcommand",
    description: "A simple way to create custom commands.",
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 2,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        usage: "customcommand create <trigger> <response>",
        examples: [""],
        command_type: "slash",
    },
    requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
    public async messageRun(ctx: Message) { 
        return ctx.reply("Work in progress...");
    }
    public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) { 
        return interaction.reply("Work in progress...");
    }
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
            guildIds: getTestGuilds(),
            registerCommandIfMissing: environment.bot.register_commands,
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            idHints: [],
        });
    }
}