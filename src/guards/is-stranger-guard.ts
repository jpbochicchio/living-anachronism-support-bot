import { Role } from "discord.js";
import { Client, GuardFunction, Next, SimpleCommandMessage } from "discordx";

export const IsStranger: GuardFunction<SimpleCommandMessage> = async (command: SimpleCommandMessage, _client: Client, next: Next) => {
  if (command.message.member?.guild.roles.cache.some((role: Role) => role.name === 'Stranger')) {
    console.log('User is a stranger, and can use this function');
    await next();
  }
};

export default IsStranger;