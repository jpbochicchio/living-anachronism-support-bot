import { Discord, Guard, SimpleCommand, SimpleCommandMessage } from "discordx";
import { GuildMember } from "discord.js";
import { IsStranger } from "../guards/role-guards.js";
import { CitizenEligibilityDetermination, userEligibleForCitizenship } from "../utilities/new-user-checks.js";
import { addRoleByName, removeRoleByName } from "../utilities/utility-functions.js";

@Discord()
export class NewMemberVerification {
  @SimpleCommand({
    description: 'Become a citizen (if your account is trustworthy)', 
    aliases: ['stranger', 'verifyme'] 
  })
  @Guard(IsStranger)
  async verifyAndPromoteStranger(command: SimpleCommandMessage): Promise<void> {
    const targetUser: GuildMember | null = command.message.member;

    if (!targetUser) {
      await command.message.reply('Looks like the bot retrieved null member data. Please reach out to Faust for fixes');
      return;
    }

    const eligibility: CitizenEligibilityDetermination = userEligibleForCitizenship(targetUser);

    if (eligibility.isEligible) {
      await addRoleByName(targetUser, 'Citizen');
      await removeRoleByName(targetUser, 'Stranger');
      await command.message.reply('You have been granted the citizen role in the Living Anachronism server, as your account passed all safety checks. You may now choose your #roles');
    } else {
      await command.message.reply(eligibility.denialReason || 'Your account could not be verified automatically');
    }
  }
}