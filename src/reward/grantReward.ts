import { addItem } from '../store/inventoryStore';
import { enqueueDialog } from '../store/gameStore';
import { DialogScript } from '../story/Dialog';
import { type Reward, RewardType } from './Reward';

export function grantReward(reward: Reward): void {
  switch (reward.type) {
    case RewardType.Cutscene:
      enqueueDialog(DialogScript.fromKeys('', reward.dialogKey));
      break;
    case RewardType.Item:
      addItem(reward.itemId, reward.amount, reward.unique);
      break;
  }
}
