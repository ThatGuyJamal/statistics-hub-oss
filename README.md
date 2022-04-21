# ⚠️Warning - In Development

_This project is in rapid development and any information is subject to change at any time._

---

# Statistics Hub OSS

📊 An open source data analytics discord bot dedicated for server owners. Created by [ThatGuyJamal](https://github.com/ThatGuyJamal) and [contributors](./.github/contributors.md)

## `Tech Stack Used`

- [MongoDB](https://www.mongodb.com/) is the main database for the project.
- [Remix-run](https://remix.run/) is the client side website for the project
- [Discord.js](https://discord.js.org/) is the discord api library used for the project.
- [Sapphire.js](https://www.sapphirejs.dev/) is the discord plugin framework for the project.

### directory's

- [Backend](./backend/) is the main source code of the bot and its functions.
- [api](./api/) is the handler for the bots api and cloud functions.
- [frontend](./frontend/) is the react client side for the bot.

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

## `Languages`

Currently supported translations. If you would like to help improve them, join our support server. You can also clone this repository, make changes to
the language [folder](./backend/src/languages/) and submit a pull request.

- English (default)
- Spanish
- Portuguese

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

### `Important Notes`

1. Because of the lack of support moving forward with many message based commands from both the discord api and library's, the bot has limited support for things
   such as a custom prefix and message commands. You can implement this yourself but just know it had no been implemented fully. _And will be removed in the future._

2. As of now, the current version of the bot is being updated rapidly and is not in a stable version. It is also being developed to be a multi-guild bot in mind, meaning you may want to disabled or enable some of the features depending on your needs.

---

Join my support server [here](https://discord.com/invite/N79DZsm3m2). You can find planned features [here](./planned.md).

You can invite the production version of the bot [here](https://discord.com/api/oauth2/authorize?client_id=946398697254703174&permissions=415001496704&scope=bot%20applications.commands).
