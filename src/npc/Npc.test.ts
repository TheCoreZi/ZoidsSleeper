import { describe, expect, it } from 'vitest';

import { CampaignStatus } from '../campaign/Campaign';
import { CAMPAIGNS } from '../campaign/campaigns';
import { loadCampaigns } from '../store/campaignStore';
import { NPCS } from './Npc';

function mariaDialogKey(currentMission: string): string {
  loadCampaigns(CAMPAIGNS, {
    sleeper_commander: { currentMission, missionNpcFlags: {}, status: CampaignStatus.Started },
  });
  const maria = NPCS.maria_flyheight;
  const dialog = maria.dialogs.find((d) => !d.unlockRequirement || d.unlockRequirement.isCompleted())
    ?? maria.dialogs[maria.dialogs.length - 1];
  return dialog.dialogKey;
}

describe('Maria Flyheight dialogs', () => {
  it('shows default dialog before interrogate_bandits', () => {
    expect(mariaDialogKey('talk_to_maria')).toBe('dialog:maria_flyheight');
  });

  it('shows fiona dialog after interrogate_bandits', () => {
    expect(mariaDialogKey('maria_van_status')).toBe('dialog:maria_fiona');
  });

  it('shows van_fled dialog after talk_to_girl', () => {
    expect(mariaDialogKey('check_van_colony')).toBe('dialog:maria_van_fled');
  });

  it('shows van_gone dialog after fight_van', () => {
    expect(mariaDialogKey('deliver_girl')).toBe('dialog:maria_van_gone');
  });
});
