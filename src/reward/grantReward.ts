import { CUTSCENES } from '../cutscene';
import { t } from '../i18n';
import { PopupMessage, PopupType } from '../models/PopupMessage';
import { advanceMission } from '../store/campaignStore';
import { enqueueDialog, setPlayerRank, showPopup } from '../store/gameStore';
import { addItem, removeItem } from '../store/inventoryStore';
import { addZoidToArmy, removeZoidFromArmy } from '../store/partyStore';
import { addCore, addTypedCore } from '../store/zoidCoreStore';
import { removeZoidData } from '../store/zoidDataStore';
import { type Reward, RewardType } from './Reward';

export function grantReward(reward: Reward): void {
  switch (reward.type) {
    case RewardType.ActivateCityAction:
      reward.action.execute();
      break;
    case RewardType.Composite:
      reward.rewards.forEach(grantReward);
      break;
    case RewardType.Cutscene:
      enqueueDialog(CUTSCENES[reward.cutsceneId].toDialogScript());
      break;
    case RewardType.Item:
      addItem(reward.itemId, reward.amount, reward.unique);
      break;
    case RewardType.MissionAdvance:
      advanceMission(reward.campaignId);
      break;
    case RewardType.RankUp:
      setPlayerRank(reward.rank, reward.faction);
      break;
    case RewardType.RemoveItem:
      removeItem(reward.itemId, reward.amount);
      break;
    case RewardType.RemoveZiData:
      removeZoidData(reward.zoidId, reward.amount);
      break;
    case RewardType.RemoveZoid:
      removeZoidFromArmy(reward.zoidId);
      break;
    case RewardType.TypedZoidCore:
      addTypedCore(reward.coreType);
      break;
    case RewardType.Zoid:
      addZoidToArmy(reward.zoidId);
      showPopup(new PopupMessage(t('ui:zoid_joined_army', { name: t(`zoids:${reward.zoidId}`) }), t('ui:new_ally'), PopupType.Victory, `images/zoids/${reward.zoidId}.png`));
      break;
    case RewardType.ZoidCore:
      addCore(reward.zoidSpeciesId);
      break;
  }
}
