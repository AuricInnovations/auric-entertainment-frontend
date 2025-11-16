// src/types/Event.ts
export type EventItem = {
  id: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  venue?: string;
  city?: string;
  country?: string;
  startTime?: string;
  endTime?: string;
  price?: number;
  currency?: string;
  tags?: string[];
};
