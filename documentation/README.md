# Documentation

## Statistics Hub OSS 

An open source project developed to help server owners and developers to collect and analyze data from their servers.

### `Tech Stack Used`

* [MongoDB](https://www.mongodb.com/) is the main database for the project.
* [Redis](https://redis.io/) is the cache for the project.
* [Next-js](https://nextjs.org/) is the dashboard for the project
* [Discord.js](https://discord.js.org/) is the API library used for the project.
* [Sapphire.js](https://www.sapphirejs.dev/) is the command/event framework for the project.

## Features

- Moderation Commands (Timeout, listbans, lock-channel, etc)
- Server Statistics (User Activity, Active Voice Channels, etc)
- Custom commands for your server supporting custom permission limiters and more!
- Fully customizable. Server admins can disabled commands globally or per channel if they wish.
- Welcome and leave messages using text, embeds, or images.
- Customizable prefixes (default: sh!)
- Customizable language translations (default: en-US)

## Uptime 

The bot is hosted on a powerful vps provider and has a `99.9%` uptime. We also have a auto backup server to start another
bot instance if the main bot crashes.

## Command list

| Name          | Description                          | Access Level | Command Type    | Scope  |
| ------------- | ------------------------------------ | ------------ | --------------- | ------ |
| ping          | Shows the bot latency.               | everyone     | slash & message | Global |
| help          | Shows the bot help menu.             | everyone     | slash & message | Global |
| invite        | Shows the bot invite link.           | everyone     | slash & message | Global |
| stats         | Shows the bot statistics.            | everyone     | slash & message | Global |
| welcome       | Configures the welcome plugin        | admins       | slash           | Global |
| customcommand | Configures the custom command plugin | admins       | slash           | Global |
| command       | Enables or disables a command        | admins       | slash           | Global |
| prefix        | Configures the bot prefix            | admins       | message         | Global |
| language      | Configures the bot language          | admins       | message         | Global |

*and much more*