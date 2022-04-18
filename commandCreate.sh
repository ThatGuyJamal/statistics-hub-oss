filename=$1
folder=$2

if [ -z filename ]
then 
  echo "You must give me a filename"
  exit 1
fi

if [ -z folder ]
then
echo "You didn't gave me any category, so talking the default name `Others`"
  folder="Others"
fi

folder=${folder^}

if [ ! -d "./src/commands/$folder" ]
then
  mkdir "./src/commands/$folder"
fi

cat <<EOT >> "./src/commands/$folder/$filename.ts"
import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire";
import type { Message } from "discord.js";
import { send } from "@sapphire/plugin-editable-commands";

@ApplyOptions<CustomCommand.Options>({
  aliases: [""],
})
export class ${filename^}Command extends Command {
  public async messageRun(ctx: Message) {
    // code goes here
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    // code slash goes here
  }
}
EOT

echo "Successfully created the file!"