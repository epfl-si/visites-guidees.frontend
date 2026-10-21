export type BlockedPeriod = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  label: Label;
  start: Date;
  end: Date;
}

type Label = {
  en: string;
  fr: string;
}
