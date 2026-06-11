import { Currency } from '../models/Currency';
import { CoreItem } from './CoreItem';
import { CoreType } from './ZoidCore';

export const CORES: Record<string, CoreItem> = {
  core_proto_core: new CoreItem(CoreType.ProtoCore, 10000, Currency.ZiMetal),
};
