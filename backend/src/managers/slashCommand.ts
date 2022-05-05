import { BotClientType, Client } from "../Client";
import { Collection, Interaction } from "../deps";
import { SlashCommand } from "../types/Command";
import { Logger } from "../utils/logger";

const resolveFolder = (folderName: string) => path.resolve(__dirname, ".", folderName);
const fs = require("fs");
const path = require("path");
// THe folder with our commands.
const DIR = "../plugins".toLowerCase()

/**
 * A class that manages all slash commands
 */
export class SlashCommandManager {
    public client: BotClientType
    public slashCommandCache: Collection<string, SlashCommand> = new Collection();

    public constructor() {
        this.client = Client
        this.slashCommandCache = new Collection();
    }

    /**
     * Loads the commands from the specified folder into the cache
     * @param options The options to pass to the command loader
     */
    public load(options: {
        path: string,
        category?: string,
        plugins?: string
    }) {
        if(!options.category) options.category = undefined
        if(!options.plugins) options.plugins = undefined
        
        const FolderPath = options.path || DIR;
        const slashCommandFolder = resolveFolder(options.path);

        //PluginMode will iterate through all SubFolders
        fs.readdirSync(FolderPath).map(async (dir: string) => {
            if (dir.endsWith(".txt")) return;
            if (!options.category && dir.endsWith(".js" || ".ts")) {
                const commandPath = path.join(FolderPath, dir);
                this.loadCommandPath(commandPath);
            } else {
                fs.readdirSync(path.join(FolderPath, dir)).map((cmd: string) => {
                    if (cmd.endsWith(".js" || ".ts") && !options.plugins) {
                        const commandPath = path.join(FolderPath, dir, cmd);
                        this.loadCommandPath(commandPath);
                    } else if (FolderPath === "../Plugins") {
                        if (cmd !== "commands") return;
                        fs.readdirSync(path.join(FolderPath, dir, cmd)).map((file: string) => {
                            if (!file.endsWith(".js" || ".ts")) return;
                            const commandPath = path.join(FolderPath, dir, cmd, file);
                            this.loadCommandPath(commandPath);
                        });
                    }
                });
            }
        });
    }

    public loadCommandPath(commandPath: string) {
        const pull = require(path.join(commandPath));
        if (pull.name) {
            pull.path = commandPath;
            this.slashCommandCache.set(pull.name, pull);
            Logger.info(`[SlashCommandManager] Loaded command ${pull.name} from ${commandPath}`);
        }

        return pull;
    }

    public reloadCommand(commandName: string) {
        const command = this.slashCommandCache.get(commandName);
        if (!command) return;
        const commandPath: string = path.join(command.path);
        delete require.cache[require.resolve(commandPath)];
        return this.loadCommandPath(commandPath);
    }
}