export interface SubCategory {
  id: number;
  name: string;
  status: 'Y' | 'N';
  parent_id: number;
  parentCategory?: {
    id: number;
    name: string;
  };
}
