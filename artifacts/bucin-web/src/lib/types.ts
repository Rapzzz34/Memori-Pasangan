export interface Memory {
  id: number;
  title: string;
  caption: string | null;
  imageUrl: string;
  memoryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: number;
  person1Name: string;
  person2Name: string;
  loveDate: string | null;
  loveMessage: string;
  coverImageUrl: string | null;
  person1Birthday: string | null;
  person2Birthday: string | null;
  updatedAt: string;
}

export interface BucketListItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string | null;
  audioUrl: string | null;
  person: string;
  createdAt: string;
}

export interface DiaryEntry {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
