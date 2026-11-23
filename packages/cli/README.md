# @cwa-dou/telekit

Command line tool to send notifications (currently Telegram) with telekit.

## Install

```bash
npm install -g @cwa-dou/telekit
# or run without installing
npx @cwa-dou/telekit --help
```

Requires Node.js >= 22.12.

## Setup

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy the bot token.
2. Get the chat ID you want to message (send a message to your bot, then open
   `https://api.telegram.org/bot<token>/getUpdates` and read `message.chat.id`).
3. Provide the token, either way:

```bash
# A) save it locally (pipe it so it stays out of shell history)
echo "<token>" | telekit init
# or, less private: telekit init --telegram-bot-token <token>

# B) or set it per process / in CI
export TELEGRAM_BOT_TOKEN=<token>
```

`TELEGRAM_BOT_TOKEN` takes precedence over the saved config. `init` also reads it from the
environment if no flag or stdin is given.

The token is stored in `$XDG_CONFIG_HOME/telekit/config.json` (default
`~/.config/telekit/config.json`). On macOS/Linux the file is restricted to mode `600`; on Windows
file modes are not enforced, so rely on your user profile's permissions.

## Usage

```bash
telekit telegram <chatId> "<message>"
```

If the message starts with `-` (e.g. a Markdown bullet), put `--` before the arguments:

```bash
telekit telegram -- <chatId> "- item one"
```

Prints the result as JSON on success:

```json
{ "ok": true, "chatId": "123456789", "messageId": 42 }
```

On failure the error message is printed to stderr and the exit code is `1`.

## Commands

| Command                                    | Description                                               |
| ------------------------------------------ | --------------------------------------------------------- |
| `telekit init [--telegram-bot-token <t>]`  | Save the bot token (flag, `TELEGRAM_BOT_TOKEN`, or stdin) |
| `telekit telegram [--] <chatId> <message>` | Send a Telegram message                                   |

## Environment variables

| Variable             | Required | Description                                             |
| -------------------- | -------- | ------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN` | no       | Bot token; overrides the config saved by `telekit init` |
| `XDG_CONFIG_HOME`    | no       | Base directory for the config file                      |

## Related packages

- [`@cwa-dou/telekit-core`](https://www.npmjs.com/package/@cwa-dou/telekit-core) - shared schemas and operations
- [`@cwa-dou/telekit-mcp`](https://www.npmjs.com/package/@cwa-dou/telekit-mcp) - local stdio MCP server

Part of [telekit](https://github.com/anhtudo97/telekit).

## License

ISC
