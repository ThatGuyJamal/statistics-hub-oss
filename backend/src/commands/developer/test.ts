import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { pauseThread } from "../../internal/functions/promises";
import { seconds } from "../../internal/functions/time";

@ApplyOptions<ICommandOptions>({
    description: "Test command for some stuff :/",
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 2,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        hidden: true,
    },
})
export class UserCommand extends ICommand {
    public async messageRun(ctx: Message) {
        await ctx.channel.send({ content: `Starting test...` })

        const errorTracked = []

        const { client } = this.container

        try {

            await ctx.channel.send({ content: "Creating test data for redis..." })

            await client.RedisController.hset("test-command-21903218", "name", "Bob").then((res) => {
                ctx.channel.send({ content: `...created status \`${res}\`` })
            }).catch(e => {
                errorTracked.push(e)
                this.container.logger.error(e)
            })
            
                await ctx.channel.send({ content: "Fetching created data..." })

                pauseThread(3)

                let result2 = await client.RedisController.hget("test-command-21903218", "name")

                await ctx.channel.send({
                    embeds: [{
                        description: `Redis Result: ${result2 || "Not found..."}`,
                    }]
                })

            await client.RedisController.del("test-command-21903218")
        } catch (e) {
            errorTracked.push(1)
            client.logger.error(e)
            await ctx.channel.send({
                embeds: [{
                    description: `Error: ${e}`,
                }]
            })
        }

        await ctx.channel.send({
            content: `Test finished! ${errorTracked.length > 0 ? `${errorTracked.length} error${errorTracked.length < 1
                ? "" : "s"} were tracked. Check the logs...` : ""}`
        })
    }
    // public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) { }
    // public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    //     registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
    //         guildIds: getTestGuilds(),
    //         registerCommandIfMissing: environment.bot.register_commands,
    //         behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
    //         idHints: [],
    //     });
    // }
}