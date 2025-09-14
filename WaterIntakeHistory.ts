import WaterEntry from './WaterEntry';

class WaterIntakeHistory {
  date: string;
  entries: WaterEntry[];

  constructor(date: string, entries: WaterEntry[]) {
    this.date = date;
    this.entries = entries;
  }
}

export { WaterIntakeHistory };
