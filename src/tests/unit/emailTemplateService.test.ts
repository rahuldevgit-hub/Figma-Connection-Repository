import { createEmailTempalte } from '@/services/emailTemplateService';
import API from '@/services/api';
import { EmailTemplateFormValues } from '@/schemas/emailTemplateSchema';

jest.mock('@/services/api');

const mockPayload: EmailTemplateFormValues = {
  title: 'Test Template',
  fromemail: 'from@example.com',
  adminemail: 'admin@example.com',
  subject: 'Test Subject',
  format: '<p>Test Content</p>',
};

describe('createEmailTempalte', () => {
  it('should return data on success', async () => {
    (API.post as jest.Mock).mockResolvedValueOnce({ data: { status: true, message: 'Created' } });
    const result = await createEmailTempalte(mockPayload);
    expect(API.post).toHaveBeenCalledWith('/admin/emailtempate/add', mockPayload);
    expect(result).toEqual({ status: true, message: 'Created' });
  });

  it('should throw error on API failure', async () => {
    (API.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    await expect(createEmailTempalte(mockPayload)).rejects.toThrow('API Error');
  });
}); 