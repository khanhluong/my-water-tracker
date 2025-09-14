import { WaterIntakeHistory } from './WaterIntakeHistory';
import WaterEntry from './WaterEntry';

const waterIntakeHistoryData: WaterIntakeHistory[] = [
  new WaterIntakeHistory('2025-09-14', [
    new WaterEntry('08:00', 250, 'Water'),
    new WaterEntry('10:30', 500, 'Water'),
    new WaterEntry('13:00', 250, 'Tea'),
  ]),
  new WaterIntakeHistory('2025-09-13', [
    new WaterEntry('09:00', 500, 'Water'),
    new WaterEntry('11:30', 250, 'Coffee'),
    new WaterEntry('14:00', 500, 'Water'),
  ]),
];

export default waterIntakeHistoryData;
