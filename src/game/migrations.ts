import { CAMPAIGNS } from '../campaign/campaigns';
import { REBORN_ATTACK_BONUS_PERCENT } from '../constants';
import type { OwnedZoid } from '../models/Zoid';
import type { SaveData } from './Save';

export type MigrationData = Partial<SaveData> & Record<string, unknown>;

type MigrationFn = (data: MigrationData) => void;

function migrateRanks(data: MigrationData): void {
  const stats = data.playerStats as Record<string, unknown> | undefined;
  if (!stats || stats.factionRanks) {return;}
  const faction = stats.faction as string | undefined;
  if (!faction || faction === 'neutral') {return;}

  const campaignsData = data.campaigns as Record<string, Record<string, unknown>> | undefined;
  const campaignId = faction === 'helic_republic' ? 'olympus_threat' : 'olympus_guylos';
  const campaign = campaignsData?.[campaignId];
  if (!campaign) {return;}

  const missionId = typeof campaign.currentMission === 'string'
    ? campaign.currentMission
    : (campaign.currentMission as Record<string, unknown>)?.id as string;

  const missionOrder = CAMPAIGNS[campaignId].missions.map((m) => m.id);
  const currentIndex = missionOrder.indexOf(missionId);
  const cadetIndex = missionOrder.indexOf('talk_to_companions');
  const recruitMission = campaignId === 'olympus_threat' ? 'go_to_training' : 'meet_recruits';
  const recruitIndex = missionOrder.indexOf(recruitMission);

  let rank: string;
  if (campaign.status === 'completed' || currentIndex >= cadetIndex) {
    rank = 'cadet';
  } else if (currentIndex >= recruitIndex) {
    rank = 'recruit';
  } else {
    return;
  }

  stats.factionRanks = { [faction]: rank };
}

function migrateGuylosSegment2(data: MigrationData): void {
  const campaignsData = data.campaigns as Record<string, Record<string, unknown>> | undefined;
  const campaign = campaignsData?.['olympus_guylos'];
  if (!campaign || campaign.status !== 'started') {return;}

  const currentMission = campaign.currentMission as Record<string, unknown> | undefined;
  if (currentMission?.id === 'coming_soon') {
    campaign.currentMission = { goalState: [], id: 'ruins_briefing' };
    campaign.missionNpcFlags = { 'olympus_guylos:imperial_training_officer': false };
  }
}

const migrations: Record<string, MigrationFn> = {
  '0.6.3': (data) => {
    migrateRanks(data);
    migrateGuylosSegment2(data);
  },
  '0.6.2': (data) => {
    const campaignsData = data.campaigns as Record<string, Record<string, unknown>> | undefined;
    if (!campaignsData) {return;}
    for (const campaign of Object.values(campaignsData)) {
      if (typeof campaign.currentMission === 'string') {
        campaign.currentMission = { goalState: [], id: campaign.currentMission };
      }
    }
  },
  '0.6.1': (data) => {
    const campaigns = data.campaigns as Record<string, Record<string, unknown>> | undefined;
    const campaign = campaigns?.['sleeper_commander'];
    if (!campaign) {return;}

    const shellsStatus = campaigns?.['shells_of_time']?.status;
    if (shellsStatus === 'started' || shellsStatus === 'completed') {
      campaigns!['sleeper_commander'] = { currentMission: '', status: 'completed' };
      return;
    }

    if (campaign.status === 'completed') {
      campaigns!['sleeper_commander'] = {
        currentMission: 'deliver_girl',
        missionNpcFlags: {},
        status: 'started',
      };
      return;
    }

    const flags = campaign.missionNpcFlags as Record<string, unknown> | undefined;
    if (flags?.['sleeper_commander:girl'] !== undefined) {
      flags['sleeper_commander:kara'] = flags['sleeper_commander:girl'];
      delete flags['sleeper_commander:girl'];
    }
  },
  '0.6.0': () => {},
  '0.5.2': () => {},
  '0.5.1': (data) => {
    const now = Date.now();
    const backfill = (zoid: OwnedZoid) => {
      if (!zoid.dateObtained) {
        (zoid as unknown as Record<string, unknown>).dateObtained = now;
      }
    };
    const zoids = data.party?.zoids as OwnedZoid[] | undefined;
    if (zoids) {
      for (const zoid of zoids) {backfill(zoid);}
    }
    const tank = data.nurturingTank as Array<Record<string, unknown>> | undefined;
    if (tank) {
      for (const slot of tank) {
        if (slot.source === 'reborn' && slot.ownedZoid) {
          backfill(slot.ownedZoid as OwnedZoid);
        }
      }
    }
  },
  '0.5.0': (data) => {
    const campaigns = data.campaigns as Record<string, Record<string, unknown>> | undefined;
    const campaign = campaigns?.['shells_of_time'];
    if (!campaign) {return;}
    const missions = CAMPAIGNS.shells_of_time.missions;
    const targetIndex = missions.findIndex((m) => m.id === 'duel_gale_evolved');
    const currentIndex = missions.findIndex((m) => m.id === campaign.currentMission);
    const pastTarget = campaign.status === 'completed' || currentIndex > targetIndex;
    if (pastTarget) {
      const stats = data.playerStats as Record<string, unknown> | undefined;
      if (stats) {
        stats.evolvingEnabled = true;
      }
    }
  },
  '0.4.9': (data) => {
    const zoids = data.party?.zoids as OwnedZoid[] | undefined;
    if (!zoids) {return;}
    for (const zoid of zoids) {
      if (zoid.rebornBonusPercent && zoid.rebornBonusPercent > 0) {
        zoid.rebornCount = Math.round(zoid.rebornBonusPercent / REBORN_ATTACK_BONUS_PERCENT);
      }
    }
  },
  '0.4.8': () => {},
  '0.4.7': (data) => {
    const stats = data.playerStats as Record<string, unknown> | undefined;
    if (stats) {
      if (stats.coreNurturingEnabled && (stats.nurturingSlots === undefined || stats.nurturingSlots === 0)) {
        stats.nurturingSlots = 1;
      }
      delete stats.coreNurturingEnabled;
    }
  },
  '0.4.6': () => {},
  '0.4.5': () => {},
  '0.4.4': () => {},
  '0.4.3': (data) => {
    const stats = data.playerStats as Record<string, unknown> | undefined;
    if (stats && !stats.faction) {
      stats.faction = 'neutral';
    }
  },
  '0.4.2': (data) => {
    const campaigns = data.campaigns as Record<string, Record<string, unknown>> | undefined;
    const campaign = campaigns?.['sleeper_commander'];
    if (!campaign) {return;}

    const shellsStatus = campaigns?.['shells_of_time']?.status;
    if (shellsStatus === 'started' || shellsStatus === 'completed') {
      campaigns!['sleeper_commander'] = { currentMission: '', status: 'completed' };
      return;
    }

    if (campaign.status === 'completed') {
      campaigns!['sleeper_commander'] = {
        currentMission: 'deliver_girl',
        missionNpcFlags: {},
        status: 'started',
      };
      return;
    }

    const flags = campaign.missionNpcFlags as Record<string, unknown> | undefined;
    if (flags?.['sleeper_commander:girl'] !== undefined) {
      flags['sleeper_commander:kara'] = flags['sleeper_commander:girl'];
      delete flags['sleeper_commander:girl'];
    }
  },
  '0.4.1': (data) => {
    if (Array.isArray(data.party)) {
      const zoids = data.party as OwnedZoid[];
      const commanderZoidId = zoids.length > 0
        ? zoids.reduce((best, z) => z.experience > best.experience ? z : best).id
        : '';
      data.party = { commanderZoidId, zoids };
    }
  },
  '0.4.0': (data) => {
    const campaigns = data.campaigns as Record<string, Record<string, unknown>> | undefined;
    const campaign = campaigns?.['sleeper_commander'];
    if (!campaign) {return;}

    const missions = CAMPAIGNS.sleeper_commander.missions;
    const targetIndex = missions.findIndex((m) => m.id === 'find_van_oasis');
    const currentIndex = missions.findIndex((m) => m.id === campaign.currentMission);
    const pastTarget = campaign.status === 'completed' || currentIndex > targetIndex;

    if (pastTarget) {
      campaigns!['sleeper_commander'] = {
        currentMission: 'find_van_oasis',
        missionNpcFlags: {},
        status: 'started',
      };
      data.landmarkId = 'wind_oasis';
      const defeats = data.pilotDefeats as Record<string, number> | undefined;
      if (defeats?.['van_shield_liger']) {
        delete defeats['van_shield_liger'];
      }
    }
  },
  '0.3.0': (data) => {
    const campaigns = data.campaigns as Record<string, Record<string, unknown>> | undefined;
    const campaign = campaigns?.['sleeper_commander'];
    if (!campaign) {return;}

    const missions = CAMPAIGNS.sleeper_commander.missions;
    const targetIndex = missions.findIndex((m) => m.id === 'maria_van_status');
    const currentIndex = missions.findIndex((m) => m.id === campaign.currentMission);
    const pastTarget = campaign.status === 'completed' || currentIndex > targetIndex;

    if (pastTarget) {
      campaigns!['sleeper_commander'] = {
        currentMission: 'maria_van_status',
        missionNpcFlags: { 'sleeper_commander:maria_flyheight': false },
        status: 'started',
      };
      data.landmarkId = 'wind_colony';
    }
  },
  '0.2.1': (data) => {
    const inv = data.inventory as Record<string, number> | undefined;
    if (!inv?.['core_probe']) {return;}
    inv['core_preserver'] = (inv['core_preserver'] ?? 0) + inv['core_probe'];
    delete inv['core_probe'];
  },
  '0.2.0': (data) => {
    const campaigns = data.campaigns as Record<string, Record<string, unknown>> | undefined;
    const campaign = campaigns?.['sleeper_commander'];
    if (!campaign) {return;}

    const missions = CAMPAIGNS.sleeper_commander.missions;
    const targetIndex = missions.findIndex((m) => m.id === 'interrogate_bandits');
    const currentIndex = missions.findIndex((m) => m.id === campaign.currentMission);
    const pastTarget = campaign.status === 'completed' || currentIndex > targetIndex;

    if (pastTarget) {
      campaigns!['sleeper_commander'] = {
        currentMission: 'interrogate_bandits',
        missionNpcFlags: { 'sleeper_commander:bianco': false },
        status: 'started',
      };
      data.landmarkId = 'elmia_ruins';
    }
  },
};

export function migrate(data: MigrationData, savedVersion: string): MigrationData {
  const versions = Object.keys(migrations)
    .filter((v) => v.localeCompare(savedVersion, undefined, { numeric: true }) > 0)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const version of versions) {
    migrations[version](data);
  }
  return data;
}
