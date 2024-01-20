import { GuildMember, Role, User } from "discord.js";
import { DateTime } from "luxon";

export type CitizenEligibilityDetermination = {
  isEligible: boolean;
  denialReason?: string;
}

export function userEligibleForCitizenship(newMember: GuildMember): CitizenEligibilityDetermination {
  const determination: CitizenEligibilityDetermination = {
    isEligible: false,
    denialReason: ''
  };

  const userData: User = newMember.user;
  const accountAgeDays: number = DateTime.fromJSDate(userData.createdAt).diffNow().as('days');

  if (!memberHasRole(newMember, 'Stranger') || memberHasRole(newMember, 'Citizen')) {
    determination.denialReason = `You could not be automatically set as a citizen. You are already a citizen, or at least not a stranger`;
    return determination;
  }
  
  if (accountAgeDays < 90) {
    determination.denialReason = `You could not be automatically set as a citizen because your account is only ${accountAgeDays} day(s) old`;
    return determination;
  }

  if (newMember.avatarURL() === newMember.user.defaultAvatarURL) {
    determination.denialReason = 'You could not be automatically set as a citizen because you are using a default avatar. This is suspicious for an old account';
    return determination;
  }
  
  console.log(`User ${newMember.displayName} is eligible for citizenship`);
  return { isEligible: true };
}

export function memberHasRole(member: GuildMember, roleName: string): boolean {
  return member.guild.roles.cache.some((role: Role) => role.name === roleName);
}