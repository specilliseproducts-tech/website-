'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  SystemIntegratorSchema,
  type SystemIntegratorInsert,
  type SystemIntegratorSelect,
} from './schema';
import { MediaUploader } from '@/components/media-uploader';

interface SystemIntegratorFormProps {
  initialData?: SystemIntegratorSelect | null;
  onSubmit: (data: SystemIntegratorInsert) => void;
  isLoading?: boolean;
}

export function SystemIntegratorForm({
  initialData,
  onSubmit,
  isLoading,
}: SystemIntegratorFormProps) {
  const [iconPath, setIconPath] = useState<string>(initialData?.icon || '');

  const form = useForm<SystemIntegratorInsert>({
    resolver: zodResolver(SystemIntegratorSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      icon: initialData?.icon || '',
      slug: initialData?.slug || '',
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    form.setValue('title', title);
    if (!initialData) {
      // Only auto-generate slug for new entries
      const slug = generateSlug(title);
      form.setValue('slug', slug);
    }
  };

  const handleIconUpload = (urls: string[]) => {
    if (urls.length > 0) {
      const url = urls[0]; // Take the first uploaded file
      setIconPath(url);
      form.setValue('icon', url);
    }
  };

  const handleSubmit = (data: SystemIntegratorInsert) => {
    onSubmit({
      ...data,
      icon: iconPath,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter system integrator title"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleTitleChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (Auto-generated from title)</FormLabel>
              <FormControl>
                <Input
                  placeholder="system-integrator-slug"
                  disabled
                  className="bg-muted"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter system integrator description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={() => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <MediaUploader
                  onUpload={handleIconUpload}
                  folderName="system-integrators"
                  type="image"
                  multiple={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading
            ? initialData
              ? 'Updating...'
              : 'Creating...'
            : initialData
            ? 'Update System Integrator'
            : 'Create System Integrator'}
        </Button>
      </form>
    </Form>
  );
}
