import { Discord, Guard, SimpleCommand, SimpleCommandMessage } from "discordx";
import { IsLivingAnachronism } from "../guards/role-guards.js";

@Discord()
export class LanguageAnalysis {
  @SimpleCommand({
    description: 'Perform language analysis on all recent server messages to identify trends',
    aliases: ['analyze', 'run-analysis', 'perform-analysis']
  })
  @Guard(IsLivingAnachronism)
  async performLanguageAnalysis(command: SimpleCommandMessage): Promise<void> {
    command.message.reply('This feature is not currently enabled in the production release of this bot');
  }
}