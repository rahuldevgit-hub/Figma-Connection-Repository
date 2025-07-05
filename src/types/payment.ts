export interface Payment {
  id: number;
  name: string;
  status: 'Y' | 'N';
  createdAt?: string;
  updatedAt?: string;
}
