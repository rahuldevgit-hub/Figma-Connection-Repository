export interface Incoterm {
  id?: number;             // Optional for new records
  name: string;
  status: 'Y' | 'N';       // Only 'Y' or 'N' allowed

  createdAt?: string;      // Timestamps from DB (optional)
  updatedAt?: string;
}
