'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MediaUploader } from '@/components/media-uploader';
import { TeamInsert, teamInsertSchema, TeamSelect } from './schema';

interface TeamFormProps {
  initialData?: Partial<TeamSelect>;
  onSubmit: (data: TeamInsert) => void;
  isLoading?: boolean;
  submitText?: string;
}

export function TeamForm({
  initialData,
  onSubmit,
  isLoading,
  submitText = 'Submit',
}: TeamFormProps) {
  const form = useForm<TeamInsert>({
    resolver: zodResolver(teamInsertSchema),
    defaultValues: {
      name: initialData?.name || '',
      position: initialData?.position || '',
      imagePath: initialData?.imagePath || '',
    },
  });

  const handleSubmit = (data: TeamInsert) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Enter full name"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">
            Position <span className="text-destructive">*</span>
          </Label>
          <Input
            id="position"
            {...form.register('position')}
            placeholder="Enter position/role"
          />
          {form.formState.errors.position && (
            <p className="text-sm text-destructive">
              {form.formState.errors.position.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imagePath">
          Profile Photo <span className="text-destructive">*</span>
        </Label>
        <MediaUploader
          type="image"
          multiple={false}
          folderName="team"
          onUpload={(urls) => {
            if (urls.length > 0) {
              form.setValue('imagePath', urls[0]);
            }
          }}
          className="w-full"
        />
        {form.formState.errors.imagePath && (
          <p className="text-sm text-destructive">
            {form.formState.errors.imagePath.message}
          </p>
        )}
      </div>

      {/* Image Preview */}
      {/* {form.watch('imagePath') && (
        <div className="space-y-2">
          <Label>Current Photo</Label>
          <div className="border rounded-lg p-4">
            <img
              src={form.watch('imagePath')}
              alt="Team member photo"
              className="w-32 h-32 object-cover rounded-full mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )} */}

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : submitText}
        </Button>
      </div>
    </form>
  );
}
