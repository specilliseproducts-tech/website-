'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { MediaUploader } from '@/components/media-uploader';
import { productInsertSchema } from './schema';
import { JSX } from 'react/jsx-runtime';

interface Props {
  data?: z.infer<typeof productInsertSchema>;
  submitAction: JSX.Element;
  onSubmit(values: z.infer<typeof productInsertSchema>): void;
}

export function ProductForm(props: Props) {
  const [newFeature, setNewFeature] = useState('');
  const [newApplication, setNewApplication] = useState('');

  const form = useForm<z.infer<typeof productInsertSchema>>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      slug: '',
      name: '',
      shortDescription: '',
      description: '',
      features: [],
      applications: [],
      modelPath: '',
      imagePath: '',
      color: '#000000',
      category: '',
      brochureUrl: '',
      ...props.data,
    },
  });

  // Function to slugify text
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Watch name field and auto-generate slug
  const watchedName = form.watch('name');

  useEffect(() => {
    if (watchedName && !props.data?.slug) {
      // Only auto-generate if not editing existing data
      const generatedSlug = slugify(watchedName);
      form.setValue('slug', generatedSlug);
    }
  }, [watchedName, form, props.data?.slug]);

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues('features');
      form.setValue('features', [...currentFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features');
    form.setValue(
      'features',
      currentFeatures.filter((_, i) => i !== index),
    );
  };

  const addApplication = () => {
    if (newApplication.trim()) {
      const currentApplications = form.getValues('applications');
      form.setValue('applications', [
        ...currentApplications,
        newApplication.trim(),
      ]);
      setNewApplication('');
    }
  };

  const removeApplication = (index: number) => {
    const currentApplications = form.getValues('applications');
    form.setValue(
      'applications',
      currentApplications.filter((_, i) => i !== index),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Laser Cutting Machine" {...field} />
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
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="laser-cutting-machine"
                    {...field}
                    disabled
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of the product"
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
                  placeholder="Detailed description of the product"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Laser Systems" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Features Section */}
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === 'Enter' && (e.preventDefault(), addFeature())
                      }
                    />
                    <Button type="button" onClick={addFeature} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1"
                      >
                        {feature}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Applications Section */}
        <FormField
          control={form.control}
          name="applications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applications</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an application"
                      value={newApplication}
                      onChange={(e) => setNewApplication(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), addApplication())
                      }
                    />
                    <Button type="button" onClick={addApplication} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((application, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1"
                      >
                        {application}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0"
                          onClick={() => removeApplication(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="imagePath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <MediaUploader
                    type="image"
                    folderName="products"
                    onUpload={(urls) => field.onChange(urls[0])}
                  />
                  {field.value && (
                    <div className="mt-2">
                      <Image
                        src={field.value}
                        alt="Product preview"
                        width={80}
                        height={80}
                        className="h-20 w-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model Upload */}
        <FormField
          control={form.control}
          name="modelPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>3D Model File</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <MediaUploader
                    type="file"
                    folderName="models"
                    onUpload={(urls) => field.onChange(urls[0])}
                  />
                  {field.value && (
                    <div className="mt-2 p-2 bg-muted rounded">
                      <p className="text-sm">
                        Model: {field.value.split('/').pop()}
                      </p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Brochure Upload */}
        <FormField
          control={form.control}
          name="brochureUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Brochure</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <MediaUploader
                    type="file"
                    folderName="brochures"
                    onUpload={(urls) => field.onChange(urls[0])}
                  />
                  {field.value && (
                    <div className="mt-2 p-2 bg-muted rounded">
                      <p className="text-sm">
                        Brochure: {field.value.split('/').pop()}
                      </p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">{props.submitAction}</div>
      </form>
    </Form>
  );
}
