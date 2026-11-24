#!/usr/bin/env node
import { Command } from "commander";
import { text } from "node:stream/consumers";
import { sendTelegramMessage } from "@cwa-dou/telekit-core";
import {
  getDefaultConfigPath,
  readTelegramBotToken,
  writeTelegramBotToken,
} from "./helps";

const program = new Command();

/** Token piped on stdin (`echo $TOKEN | telekit init`); undefined when stdin is a terminal. */
async function readTokenFromStdin() {
  if (process.stdin.isTTY) return undefined;
  return text(process.stdin);
}

program
  .name("telekit")
  .description("TeleKit CLI backed by @cwa-dou/telekit-core");

program
  .command("init")
  .description("Save the Telegram bot token to local config")
  .option(
    "--telegram-bot-token <botToken>",
    "Telegram bot token (visible in shell history; prefer TELEGRAM_BOT_TOKEN env or stdin)",
  )
  .action(async (options: { telegramBotToken?: string }) => {
    const token = (
      options.telegramBotToken ||
      process.env.TELEGRAM_BOT_TOKEN ||
      (await readTokenFromStdin()) ||
      ""
    ).trim();

    if (!token) {
      throw new Error(
        "Telegram bot token is required. Pass --telegram-bot-token, set TELEGRAM_BOT_TOKEN, or pipe it on stdin.",
      );
    }

    writeTelegramBotToken(token);
    console.log(`Saved TeleKit CLI config to ${getDefaultConfigPath()}`);
  });

program
  .command("telegram")
  .description(
    "Send a Telegram message (use `--` before args if the message starts with `-`)",
  )
  .argument("<chatId>", "Telegram chat ID")
  .argument("<message>", "Message text to send")
  .action(async (chatId: string, message: string) => {
    const result = await sendTelegramMessage({
      botToken: readTelegramBotToken(),
      chatId,
      message,
    });

    console.log(JSON.stringify(result));
  });

await program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
