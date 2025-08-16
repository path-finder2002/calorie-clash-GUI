import type { GameRule } from '../../models';

export type SettingsScreenProps = { onClose: () => void; rule: GameRule; onChangeRule: (r: GameRule) => void };
