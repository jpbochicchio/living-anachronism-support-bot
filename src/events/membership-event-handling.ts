import { ArgsOf, Client, Discord, On } from "discordx";
import type { NewMemberArguments } from "../types/event-types.js";
import { CitizenEligibilityDetermination, userEligibleForCitizenship } from "../utilities/new-user-checks.js";
import { Collection, Role } from "discord.js";
import { addRoleByName, isDefined, removeRoleByName } from "../utilities/utility-functions.js";

@Discord()
export class MembershipEventHandler {
  @On({ event: 'guildMemberAdd' })
  async onNewMember([newMember]: NewMemberArguments, _client: Client, _guardPayload: any): Promise<void> {
    const eligibility: CitizenEligibilityDetermination = userEligibleForCitizenship(newMember);

    if (eligibility.isEligible) {
      console.log(`User ${newMember.displayName} is eligible. Fetching roles and applying changes`);
    
      await addRoleByName(newMember, 'Citizen');
      await removeRoleByName(newMember, 'Stranger');
      await newMember.send('You have been granted the citizen role in the Living Anachronism server, as your account passed all safety checks');
    }
  }
}