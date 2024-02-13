import { GuildMember, Role } from "discord.js";
import { memberHasRole } from "./new-user-checks.js";

export function isDefined(x: unknown): boolean {
  return (undefined !== x && null !== x);
}

export async function removeRoleByName(member: GuildMember, roleName: string): Promise<void> {
  const resolvedTargetRole: Role | undefined = member.guild.roles.cache.find(r => roleName === r.name);

  if (isDefined(resolvedTargetRole) && memberHasRole(member, roleName)) {
    await member.roles.remove(resolvedTargetRole as Role);
    console.log(`Removed role '${roleName}' from user '${member.displayName}'`);
  } else {
    console.log(`Role '${roleName}' could not be found in the role cache. No changes were made`);
  }
}

export async function addRoleByName(member: GuildMember, roleName: string): Promise<void> {
  const resolvedTargetRole: Role | undefined = member.guild.roles.cache.find(r => roleName === r.name);

  if (isDefined(resolvedTargetRole) && !memberHasRole(member, roleName)) {
    await member.roles.add(resolvedTargetRole as Role);
    console.log(`Added role '${roleName}' to user '${member.displayName}'`);
  } else {
    console.log(`Role '${roleName}' could not be added to user '${member.displayName}'`);
  }
}

export function panicIfUndefined<T>(value: T | undefined): asserts value is T {
  if (undefined === value || typeof value === "undefined" || null === value) {
    throw new Error('Supplied value was null or undefined - terminating calling process');
  }
}