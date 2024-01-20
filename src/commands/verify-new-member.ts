import { Discord, Guard, SimpleCommand, SimpleCommandMessage } from "discordx";
import { GuildMember } from "discord.js";
import { IsStranger } from "../guards/is-stranger-guard.js";

@Discord()
export class NewMemberVerification {
  @SimpleCommand({
    description: 'Become a citizen (if your account is trustworthy)', 
    aliases: ['stranger', 'verifyme'] 
  })
  @Guard(IsStranger)
  async verifyAndPromoteStranger(command: SimpleCommandMessage): Promise<void> {
    const targetUser: GuildMember | null = command.message.member;
    await command.message.reply('You should see this message ONLY if I have the stranger role.');
  }

  private isGuildMember(user: GuildMember | null): user is GuildMember {
    return null !== user;
  }
}