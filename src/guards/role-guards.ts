import { Role } from "discord.js";
import { Client, GuardFunction, Next, SimpleCommandMessage } from "discordx";

export const IsStranger: GuardFunction<SimpleCommandMessage> = async (command: SimpleCommandMessage, _client: Client, next: Next) => {
  if (command.message.member?.roles.cache.some((role: Role) => 'Stranger' === role.name)) {
    console.log('User is a stranger, and can use this function');
    await next();
  }
};

export const IsAdmin: GuardFunction<SimpleCommandMessage> = async (command: SimpleCommandMessage, _client: Client, next: Next) => {
  if (command.message.member?.roles.cache.some((role: Role) => ['Royal Court', 'Living Anachronism'].includes(role.name))) {
    await next();
  }
}

export const IsLivingAnachronism: GuardFunction<SimpleCommandMessage> = async (command: SimpleCommandMessage, _client: Client, next: Next) => {
  if (command.message.member?.roles.cache.some((role: Role) => 'Living Anachronism' === role.name)) {
    await next();
  }
}