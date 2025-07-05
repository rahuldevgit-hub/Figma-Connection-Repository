export interface Country {
  id: number;
  name: string;
  words: string; // ✅ required by the edit page
  status?: 'Y' | 'N';
  createdAt?: string;
  updatedAt?: string;
}
