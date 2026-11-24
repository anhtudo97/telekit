import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { z } from "zod";

const cliConfigSchema = z.object({
  telegramBotToken: z.string().min(1).optional(),
});

export const missingTokenMessage =
  "Telegram bot token is required. Set TELEGRAM_BOT_TOKEN or run `telekit init`.";

/** `$XDG_CONFIG_HOME/telekit/config.json`, falling back to `~/.config/telekit/config.json`. */
export function getDefaultConfigPath(env: NodeJS.ProcessEnv = process.env) {
  const base = env.XDG_CONFIG_HOME || join(homedir(), ".config");
  return join(base, "telekit", "config.json");
}

/** Persist the token. `mode` only applies on creation, so chmod covers pre-existing files (POSIX). */
export function writeTelegramBotToken(token: string, configPath = getDefaultConfigPath()) {
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify({ telegramBotToken: token }, null, 2)}\n`, {
    mode: 0o600,
  });
  chmodSync(configPath, 0o600);
}

/** Resolve the token: `TELEGRAM_BOT_TOKEN` env first, then the config file. */
export function readTelegramBotToken(
  configPath = getDefaultConfigPath(),
  env: NodeJS.ProcessEnv = process.env,
) {
  if (env.TELEGRAM_BOT_TOKEN) return env.TELEGRAM_BOT_TOKEN;

  let raw: string;
  try {
    raw = readFileSync(configPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(missingTokenMessage, { cause: error });
    }
    throw new Error(`Cannot read config at ${configPath}: ${(error as Error).message}`, {
      cause: error,
    });
  }

  const invalid = (cause?: unknown) =>
    new Error(`Invalid config at ${configPath}. Fix it or run \`telekit init\` to rewrite it.`, {
      cause,
    });

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (error) {
    throw invalid(error);
  }

  const parsed = cliConfigSchema.safeParse(json);
  if (!parsed.success) throw invalid(parsed.error);
  if (!parsed.data.telegramBotToken) throw new Error(missingTokenMessage);

  return parsed.data.telegramBotToken;
}
