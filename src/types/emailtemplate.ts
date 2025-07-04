export type EmailTempalte = {
  id: string;
  title: string;
  fromemail: string;
  adminemail: string;
  subject: string;       // ✅ Add this
  format: string;
  createdAt?: string;
  updatedAt?: string;
    status: 'Y' | 'N';

};



