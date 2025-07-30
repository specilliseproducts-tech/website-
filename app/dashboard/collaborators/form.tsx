'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MediaUploader } from '@/components/media-uploader';
import { CollaboratorInsert } from './schema';

interface CollaboratorFormProps {
  onSubmit: (data: CollaboratorInsert) => void;
  isLoading?: boolean;
  submitText?: string;
  defaultValues?: Partial<CollaboratorInsert>;
}

export function CollaboratorForm({
  onSubmit,
  isLoading = false,
  submitText = 'Submit',
  defaultValues = {},
}: CollaboratorFormProps) {
  const [formData, setFormData] = useState<CollaboratorInsert>({
    name: defaultValues.name || '',
    description: defaultValues.description || '',
    longDescription: defaultValues.longDescription || '',
    logo: defaultValues.logo || '',
    website: defaultValues.website || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Collaborator name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description</Label>
        <Textarea
          id="longDescription"
          name="longDescription"
          value={formData.longDescription}
          onChange={handleChange}
          placeholder="Detailed description"
          required
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <MediaUploader
          type="image"
          multiple={false}
          folderName="collaborators"
          onUpload={(urls) => {
            if (urls.length > 0) {
              setFormData((prev) => ({ ...prev, logo: urls[0] }));
            }
          }}
          className="w-full"
        />
        {formData.logo && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-1">Current logo:</p>
            <Image
              src={formData.logo}
              alt="Logo preview"
              width={64}
              height={64}
              className="h-16 w-16 object-contain rounded border"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Loading...' : submitText}
      </Button>
    </form>
  );
}
