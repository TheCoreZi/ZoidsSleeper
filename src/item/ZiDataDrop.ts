import { t } from '../i18n';
import { PopupMessage, PopupType } from '../models/PopupMessage';
import { ZoidResearchStatus } from '../models/ZoidResearchStatus';
import { showPopup } from '../store/gameStore';
import { getZoidDataCount, incrementZoidData } from '../store/zoidDataStore';
import { updateZoidResearch } from '../store/zoidResearchStore';
import { Drop, DropType } from './Drop';

export class ZiDataDrop extends Drop {
  type: typeof DropType.ZiData = DropType.ZiData;
  zoidId: string;

  constructor(zoidId: string, chance: number) {
    super(chance);
    this.zoidId = zoidId;
  }

  canDrop(): boolean {
    return true;
  }

  grant(): void {
    const isNew = getZoidDataCount(this.zoidId) === 0;
    const image = `images/zoids/${this.zoidId}.png`;
    incrementZoidData(this.zoidId);
    updateZoidResearch(this.zoidId, ZoidResearchStatus.Scanned);
    const name = `${this.zoidId} Zi-Data`;
    showPopup(new PopupMessage(name, t('ui:enemy_drop'), PopupType.Item, image));
    if (isNew) {
      showPopup(new PopupMessage(name, t('ui:new_zdata'), PopupType.Item, image));
    }
  }
}
