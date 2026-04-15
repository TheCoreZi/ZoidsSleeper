import { CUTSCENES } from '../cutscene';
import { advanceMission } from '../store/campaignStore';
import { addItem } from '../store/inventoryStore';
import { enqueueDialog } from '../store/gameStore';
import { type Reward, RewardType } from './Reward';

export function grantReward(reward: Reward): void {
  switch (reward.type) {
    case RewardType.Cutscene:
      enqueueDialog(CUTSCENES[reward.cutsceneId].toDialogScript());
      break;
    case RewardType.Item:
      addItem(reward.itemId, reward.amount, reward.unique);
      break;
    case RewardType.MissionAdvance:
      advanceMission(reward.campaignId);
      break;
  }
}
