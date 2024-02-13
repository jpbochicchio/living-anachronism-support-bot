import { Discord, Guard, SimpleCommand, SimpleCommandMessage } from "discordx";
import { Client, Collection, Guild, GuildMember, OAuth2Guild, RoleManager } from "discord.js";
import { IsAdmin, IsStranger } from "../guards/role-guards.js";
import { CitizenEligibilityDetermination, getRole, memberHasRole, userEligibleForCitizenship } from "../utilities/new-user-checks.js";
import { addRoleByName, removeRoleByName, panicIfUndefined} from "../utilities/utility-functions.js";

@Discord()
export class NewMemberVerification {
  private verifyAllRunning: boolean = false;

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

  @SimpleCommand({
    description: 'Attempts to verify every user with the "Stranger" role',
    aliases: ['verifyall', 'massverify', 'triggerglobalverify']
  })
  @Guard(IsAdmin)
  async verifyAllStrangers(command: SimpleCommandMessage): Promise<void> {
    if (this.verifyAllRunning) {
      await command.message.reply('Another admin has already started this command. Wait for the previous run to finish');
      return;
    }

    this.verifyAllRunning = true;

    const guildMembers: Collection<string, GuildMember> | undefined = await command.message.guild?.members.fetch();
    panicIfUndefined(guildMembers);

    guildMembers.forEach(async (member: GuildMember) => {
      console.log(`Checking roles for ${member.displayName}`);
      if (memberHasRole(member, 'Stranger') && userEligibleForCitizenship(member).isEligible) {
        console.log(`Updating roles for ${member.displayName}`);
        await addRoleByName(member, 'Citizen');
        await removeRoleByName(member, 'Stranger');
      }
    });

    this.verifyAllRunning = false;
  }
}