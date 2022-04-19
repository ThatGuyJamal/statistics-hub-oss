# Statistics Hub OSS

📊 A discord bot dedicated for server owners. Created by [ThatGuyJamal](https://github.com/ThatGuyJamal)

## `Get starting`

Coming soon...

## `Commands`

| Name       | Description                                          | Access Level  | Command Type    | Scope      |
| :--------- | :--------------------------------------------------- | :------------ | :-------------- | :--------- |
| ping       | Shows the bot latency.                               | everyone      | slash & message | Global     |
| invite     | Sends a url to invite the bot in discord.            | everyone      | slash & message | Global     |
| commands   | Shows detailed information about the bot commands.   | everyone      | slash           | Global     |
| stats      | Shows detailed statistics on the bots host computer. | everyone      | slash & message | Global     |
| statistics | Manages or views guild information                   | Administrator | slash           | Global     |
| configure  | Enables a admin to change bot property's.            | Administrator | slash           | Global     |
| cache      | Shows the current active cache values collected.     | Developer     | slash           | Guild Only |
| djs        | Allows the developer&#x20;                           | Developer     | slash           | Guild Only |
| eval       | Executes js code                                     | Developer     | slash           | Guild Only |
| reload     | Reloads a piece of the bot                           | Developer     | slash           | Guild Only |

---

## `Self Hosting Guide`

I highly recommend using the live version of the bot and not self hosting. I will not prove detailed information or tech support
if something goes wrong in the process. While being open source, and free to use and published under the [GNU](./LICENSE) Public License I will help you get
started with the bot.

### `Requirements`

1.  ⭐Star this repository to show some support.

2.  Have Nodejs installed on your computer. With version 17.0.0 or higher.

3.  Go to mongodb.com and create a database, then save the connection url.

4.  Clone this repository, and rename the example.config.ts file to config.ts and fill it out.

5.  Install the dependency's and then compile the code using `yarn compile`.

6.  Lastly you can run the bot using `yarn start`.&#x20;

---

Join my support server [here]()
