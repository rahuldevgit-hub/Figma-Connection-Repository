export interface Customer {
  id: number;
 name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  dob: string;
  gender: string;
  landmark: string;
  address: string;
  categories: string;
  status: 'Active' | 'Inactive';
}
