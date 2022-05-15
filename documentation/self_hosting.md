# `Self Hosting Guide`

I highly recommend using the [live version](https://discord-statistics.vercel.app/invite) of the bot and not self-hosting. I will not prove detailed information or tech support if something goes wrong in the process. While being open-source, and free to use and published under the [GNU](LICENSE/) Public License I will try help you get started with the basics.

#### `Requirements`

1. ⭐Star this repository to show some support.
2. Have Nodejs installed on your computer. With version 17.0.0 or higher.
3. Go to mongodb.com and create a database, then save the connection url.
4. Clone this repository, and rename the [example.config.ts](backend/src/) file to config.ts and fill it out.
5. Install the dependency and then compile the code using `yarn compile`.
6. Lastly you can run the bot using `yarn start`.

#### `Important Notes`

1. Because of the lack of support moving forward with many message-based commands from both the discord API and libraries, the bot has limited support for things such as a custom prefix and message commands. You can implement this yourself but just know it had not been implemented fully. _And will be removed in the future._
2. As of now, the current version of the bot is being updated rapidly and is not in a stable version. It is also being developed to be a multi-guild bot in mind, meaning you may want to disable or enable some of the features depending on your needs.
3. If you want to host on Linux, read this gist for the [commands](https://gist.github.com/ThatGuyJamal/42a65ede25b5da6d84c04eada89d12ff).
