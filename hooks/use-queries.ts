import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { PaginationParams } from '@/lib/apiClient';
import { toast } from '@/hooks/use-toast';
import { ProductInsert } from '@/app/dashboard/products/schema';

// Account hooks
export function useAccounts(
  params?: PaginationParams & { companyId?: string },
) {
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => apiClient.getAccounts(params),
    select: (data) => (data.success ? data.data : null),
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      parentId?: string;
      isGroup: boolean;
      companyId: string;
    }) => apiClient.createAccount(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        toast({
          title: 'Success',
          description: 'Account created successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create account',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name: string;
        parentId?: string;
        isGroup: boolean;
        companyId: string;
      };
    }) => apiClient.updateAccount(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        toast({
          title: 'Success',
          description: 'Account updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update account',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update account',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteAccount(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        toast({
          title: 'Success',
          description: 'Account deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete account',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete account',
        variant: 'destructive',
      });
    },
  });
}

// Product hooks
export function useProducts(params?: PaginationParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => apiClient.getProducts(params),
    select: (data) => (data.success ? data.data : null),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductInsert) => apiClient.createProduct(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create product',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductInsert }) =>
      apiClient.updateProduct(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update product',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete product',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    },
  });
}

// Contact Forms hooks
export function useContactForms(
  params?: PaginationParams & { search?: string },
) {
  return useQuery({
    queryKey: ['contact-forms', params],
    queryFn: () => apiClient.getContactForms(params),
    select: (data) => (data.success ? data.data : null),
  });
}

export function useContactForm(id: string) {
  return useQuery({
    queryKey: ['contact-forms', id],
    queryFn: () => apiClient.getContactForm(id),
    select: (data) => (data.success ? data.data : null),
  });
}

export function useCreateContactForm() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
    }) => apiClient.createContactForm(data),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: 'Success',
          description:
            'Message sent successfully! We will get back to you soon.',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to send message',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateContactForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        name: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
      }>;
    }) => apiClient.updateContactForm(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['contact-forms'] });
        toast({
          title: 'Success',
          description: 'Contact form updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update contact form',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update contact form',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteContactForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteContactForm(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['contact-forms'] });
        toast({
          title: 'Success',
          description: 'Contact form deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete contact form',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete contact form',
        variant: 'destructive',
      });
    },
  });
}

// Gallery hooks
export function useGalleryItems(
  params?: PaginationParams & { search?: string; category?: string },
) {
  return useQuery({
    queryKey: ['gallery-items', params],
    queryFn: () => apiClient.getGalleryItems(params),
    select: (data) => (data.success ? data.data : null),
  });
}

export function useGalleryItem(id: string) {
  return useQuery({
    queryKey: ['gallery-items', id],
    queryFn: () => apiClient.getGalleryItem(id),
    select: (data) => (data.success ? data.data : null),
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      category: string;
      title: string;
      subtitle: string;
      imagePath: string;
    }) => apiClient.createGalleryItem(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
        toast({
          title: 'Success',
          description: 'Gallery item created successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create gallery item',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create gallery item',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        category: string;
        title: string;
        subtitle: string;
        imagePath: string;
      }>;
    }) => apiClient.updateGalleryItem(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
        toast({
          title: 'Success',
          description: 'Gallery item updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update gallery item',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update gallery item',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteGalleryItem(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
        toast({
          title: 'Success',
          description: 'Gallery item deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete gallery item',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete gallery item',
        variant: 'destructive',
      });
    },
  });
}

// Team hooks
export function useTeams(
  params?: PaginationParams & { search?: string; position?: string },
) {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: async () => {
      console.log('useTeams - Fetching with params:', params);
      const result = await apiClient.getTeams(params);
      console.log('useTeams - API result:', result);
      return result;
    },
    select: (data) => {
      console.log('useTeams - Raw data:', data);
      console.log('useTeams - data.success:', data.success);
      console.log('useTeams - data.data:', data.data);

      if (data.success && data.data) {
        const selected = data.data;
        console.log('useTeams - Selected data (teams):', selected.teams);
        console.log(
          'useTeams - Selected data (pagination):',
          selected.pagination,
        );
        return selected;
      }

      console.log('useTeams - Returning null due to unsuccessful response');
      return null;
    },
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => apiClient.getTeam(id),
    select: (data) => (data.success ? data.data : null),
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; position: string; imagePath: string }) =>
      apiClient.createTeam(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['teams'] });
        toast({
          title: 'Success',
          description: 'Team member created successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create team member',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create team member',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name: string;
        position: string;
        imagePath: string;
      };
    }) => apiClient.updateTeam(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['teams'] });
        toast({
          title: 'Success',
          description: 'Team member updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update team member',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update team member',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTeam(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['teams'] });
        toast({
          title: 'Success',
          description: 'Team member deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete team member',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete team member',
        variant: 'destructive',
      });
    },
  });
}
