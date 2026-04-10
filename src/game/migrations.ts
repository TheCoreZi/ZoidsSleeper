import type { SaveData } from './Save';

export type MigrationData = Partial<SaveData> & Record<string, unknown>;

type MigrationFn = (data: MigrationData) => void;

const migrations: Record<string, MigrationFn> = {
  // Example for future use:
  // '0.2.0': (data) => { data.newField = 'default'; },
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
