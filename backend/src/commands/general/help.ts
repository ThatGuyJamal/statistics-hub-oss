import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";

@ApplyOptions<ICommandOptions>({
    description: "Shows command information.",
    aliases: ["h", "commands", "cmds"],
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 2,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        usage: "",
        examples: [""],
        command_type: "both",
    },
})
export class UserCommand extends ICommand {
    public async messageRun(ctx: Message) { 
        ctx.reply("soon")
    }
    public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
        interaction.reply("soon");
     }
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
            guildIds: getTestGuilds(),
            registerCommandIfMissing: environment.bot.register_commands,
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            idHints: ["97360358034076473"],
        });
    }
}