export interface EnquiryAttributes {
    id?: number;
    name: string;
    email: string;
    mobile?: string;
    subject?: string;
    country?: any;
    status?: 'Y' | 'N';
    createdAt?: Date;
    updatedAt?: Date;
};