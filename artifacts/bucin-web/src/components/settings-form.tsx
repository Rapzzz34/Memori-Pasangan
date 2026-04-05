import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSettings } from "@/hooks/use-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

const settingsSchema = z.object({
  person1Name: z.string().min(1, "Name is required"),
  person2Name: z.string().min(1, "Name is required"),
  loveDate: z.string().optional().nullable(),
  loveMessage: z.string().min(1, "Message is required"),
});

export function SettingsForm() {
  const { settings, updateSettings, isUpdating } = useSettings();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      person1Name: "",
      person2Name: "",
      loveDate: "",
      loveMessage: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        person1Name: settings.person1Name,
        person2Name: settings.person2Name,
        loveDate: settings.loveDate ? settings.loveDate.split('T')[0] : "",
        loveMessage: settings.loveMessage,
      });
    }
  }, [settings, form]);

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    updateSettings({
      data: {
        ...values,
        loveDate: values.loveDate ? new Date(values.loveDate).toISOString() : null,
      },
    });
  }

  if (!settings) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Card className="shadow-sm border-primary/10">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-primary">Journal Settings</CardTitle>
        <CardDescription>
          Customize the details of your shared journal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="person1Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Person's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Romeo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="person2Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Person's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Juliet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="loveDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anniversary Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loveMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write a sweet message to show on the homepage..." 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating} className="gap-2">
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
