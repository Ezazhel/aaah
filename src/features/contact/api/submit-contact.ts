import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';

export type ContactFormData = {
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // Anti-spam honeypot field
};

export type ContactResponse = {
  success: boolean;
  message: string;
};

export const submitContact = (data: ContactFormData): Promise<ContactResponse> => {
  return apiClient.post('/contact', data);
};

type UseSubmitContactOptions = {
  mutationConfig?: MutationConfig<typeof submitContact>;
};

export const useSubmitContact = ({ mutationConfig }: UseSubmitContactOptions = {}) => {
  return useMutation({
    mutationFn: submitContact,
    ...mutationConfig,
  });
};
