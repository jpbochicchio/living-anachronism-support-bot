import { dirname, importx } from "@discordx/importer";
import type { Guild, Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";

export const bot = new Client({
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],

  // Debug logs are disabled in silent mode
  silent: false,

  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: "!",
  },
});

bot.once("ready", async () => {
  // Make sure all guilds are cached
  await bot.guilds.fetch();

  await bot.guilds.cache.forEach(async (cachedGuild: Guild) => { 
    console.log(`Populating cache for guild '${cachedGuild.name}'`);
    await cachedGuild.roles.fetch();
  });

  // Synchronize applications commands with Discord
  await bot.initApplicationCommands();

  console.log("Initialization complete");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", async (message: Message) => {
  await bot.executeCommand(message);
});

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error("BOT_TOKEN could not be found in the environment variables list");
  }

  // Log in with your bot token
  await bot.login(process.env.BOT_TOKEN);
}

void run();
