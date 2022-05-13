# ⚠️Warning - In Development

_This project is in rapid development and any information is subject to change at any time._

---

# Statistics Hub OSS

![Discord](https://img.shields.io/discord/837830514130812970?style=flat-square) ![GitHub language count](https://img.shields.io/github/languages/count/ThatGuyJamal/statistics-hub-oss?style=flat-square) ![Lines of code](https://img.shields.io/tokei/lines/github/ThatGuyJamal/statistics-hub-oss?style=flat-square) ![GitHub repo size](https://img.shields.io/github/repo-size/ThatGuyJamal/statistics-hub-oss?style=flat-square)

📊 An open source data analytics discord bot dedicated for server owners. Created by [ThatGuyJamal](https://github.com/ThatGuyJamal) and [contributors](./.github/contributors.md)

## `Tech Stack Used`

- [MongoDB](https://www.mongodb.com/) is the main database for the project.
- [Redis](https://redis.io/) is the cache for the project.
- [Next-js](https://nextjs.org/) is the dashboard for the project
- [Discord.js](https://discord.js.org/) is the api library used for the project.
- [Sapphire.js](https://www.sapphirejs.dev/) is the command/event framework for the project.

### Directory's

- [Backend](./backend/) is the main source code of the bot and its functions.
- [api](./api/) is the handler for the bots api and cloud functions.
- [frontend](./frontend/) is the react client side for the bot.

## `Commands`

| Name          | Description                          | Access Level | Command Type    | Scope  |
| :------------ | :----------------------------------- | :----------- | :-------------- | :----- |
| ping          | Shows the bot latency.               | everyone     | slash & message | Global |
| help          | Shows the bot help menu.             | everyone     | slash & message | Global |
| invite        | Shows the bot invite link.           | everyone     | slash & message | Global |
| stats         | Shows the bot statistics.            | everyone     | slash & message | Global |
| welcome       | Configures the welcome plugin        | admins       | slash           | Global |
| customcommand | Configures the custom command plugin | admins       | slash           | Global |
| command       | Enables or disables a command        | admins       | slash           | Global |
| prefix        | Configures the bot prefix            | admins       | message         | Global |
| language      | Configures the bot language          | admins       | message         | Global |

*More commands will be added to the list in the future.*

## `Languages`

Currently supported translations. If you would like to help improve them, join our support server. You can also clone this repository, make changes to
the language [folder](./backend/src/languages/) and submit a pull request.

- English (default)
- Spanish

_make a pr to add more languages_

---

## `Self Hosting Guide`

I highly recommend using the live version of the bot and not self hosting. I will not prove detailed information or tech support
if something goes wrong in the process. While being open source, and free to use and published under the [GNU](./LICENSE) Public License I will help you get
started with the bot.

### `Requirements`

1. ⭐Star this repository to show some support.

2. Have Nodejs installed on your computer. With version 17.0.0 or higher.

3. Go to mongodb.com and create a database, then save the connection url.

4. Clone this repository, and rename the [example.config.ts](./backend/src) file to config.ts and fill it out.

5. Install the dependency's and then compile the code using `yarn compile`.

6. Lastly you can run the bot using `yarn start`.&#x20;

### `Important Notes`

1. Because of the lack of support moving forward with many message based commands from both the discord api and library's, the bot has limited support for things
   such as a custom prefix and message commands. You can implement this yourself but just know it had no been implemented fully. _And will be removed in the future._

2. As of now, the current version of the bot is being updated rapidly and is not in a stable version. It is also being developed to be a multi-guild bot in mind, meaning you may want to disabled or enable some of the features depending on your needs.

3. If you want to host on linux, read this gist for the [commands](https://gist.github.com/ThatGuyJamal/42a65ede25b5da6d84c04eada89d12ff).

---

Join my support server [here](https://discord.com/invite/N79DZsm3m2). You can find planned features [here](https://github.com/ThatGuyJamal/statistics-hub-oss/projects/2).

You can invite the production version of the bot [here](https://discord.com/api/oauth2/authorize?client_id=946398697254703174&permissions=415001496704&scope=bot%20applications.commands).

### `Miscellaneous`

- Project started on `2022-03-07`
- The [Documentation](./documentation/) is being managed by [gitbook](https://www.gitbook.com/)'s auto github integration. Any files changed in markdown format will be automatically updated on the gitbook website.