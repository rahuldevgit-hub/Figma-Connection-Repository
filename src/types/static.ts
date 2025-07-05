export interface Static {
  id: number;
  title: string;
  content: string;
  image?: string; // ✅ <-- Add this line
  status?: 'Y' | 'N';
  createdAt?: string;
  updatedAt?: string;
}