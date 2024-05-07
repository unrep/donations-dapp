export type Campaign = {
  id: string;
  title: string;
  image: string;
  raised: number;
  goal: number;
  description: string;
  createdAt?: Date;
  donationsCount?: number;
};
