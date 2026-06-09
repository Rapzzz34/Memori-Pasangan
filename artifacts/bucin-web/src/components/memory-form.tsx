import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemories } from "@/hooks/use-memories";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon } from "lucide-react";
import type { Memory } from "@/lib/types";

// Custom schema for creating (requires photo)
const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  caption: z.string().min(1, "Caption is required"),
  memoryDate: z.string().optional().nullable(),
  photo: z.any().refine((val) => val instanceof File, "Photo is required"),
});

// Custom schema for updating (no photo required)
const updateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  caption: z.string().min(1, "Caption is required"),
  memoryDate: z.string().optional().nullable(),
});

interface MemoryFormProps {
  memory?: Memory;
  onSuccess: () => void;
}

export function MemoryForm({ memory, onSuccess }: MemoryFormProps) {
  const isEditing = !!memory;
  const { createMemory, updateMemory, isCreating, isUpdating } = useMemories();
  const [previewUrl, setPreviewUrl] = useState<string | null>(memory?.imageUrl || null);

  const schema = isEditing ? updateSchema : createSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: memory?.title || "",
      caption: memory?.caption || "",
      memoryDate: memory?.memoryDate ? memory.memoryDate.split('T')[0] : "",
      photo: undefined,
    },
  });

  const isSubmitting = isCreating || isUpdating;

  function onSubmit(values: any) {
    if (isEditing) {
      updateMemory({
        id: memory.id,
        data: {
          title: values.title,
          caption: values.caption,
          memoryDate: values.memoryDate ? new Date(values.memoryDate).toISOString() : null,
        },
      }, {
        onSuccess: () => onSuccess(),
      });
    } else {
      createMemory({
        data: {
          title: values.title,
          caption: values.caption,
          memoryDate: values.memoryDate ? new Date(values.memoryDate).toISOString() : undefined,
          photo: values.photo,
        },
      }, {
        onSuccess: () => onSuccess(),
      });
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('/api')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="A special day..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell the story behind this memory..." 
                  className="resize-none h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memoryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Memory (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEditing && (
          <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, onChange)}
                      {...field}
                    />
                    {previewUrl && (
                      <div className="relative aspect-video rounded-md overflow-hidden bg-muted border border-border flex items-center justify-center">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="object-contain w-full h-full"
                        />
                      </div>
                    )}
                    {!previewUrl && (
                      <div className="aspect-video rounded-md bg-muted border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground text-sm">
                        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                        Select an image to preview
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Add Memory"}
        </Button>
      </form>
    </Form>
  );
}
