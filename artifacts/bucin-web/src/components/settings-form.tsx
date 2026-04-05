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
import { Loader2, Save, Lock } from "lucide-react";

const settingsSchema = z.object({
  person1Name: z.string().min(1, "Nama wajib diisi"),
  person2Name: z.string().min(1, "Nama wajib diisi"),
  loveDate: z.string().optional().nullable(),
  loveMessage: z.string().min(1, "Pesan wajib diisi"),
  person1Birthday: z.string().optional().nullable(),
  person2Birthday: z.string().optional().nullable(),
  person1Password: z.string().optional(),
  person2Password: z.string().optional(),
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
      person1Birthday: "",
      person2Birthday: "",
      person1Password: "",
      person2Password: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        person1Name: settings.person1Name,
        person2Name: settings.person2Name,
        loveDate: settings.loveDate ? settings.loveDate.split('T')[0] : "",
        loveMessage: settings.loveMessage,
        person1Birthday: settings.person1Birthday ? settings.person1Birthday.split('T')[0] : "",
        person2Birthday: settings.person2Birthday ? settings.person2Birthday.split('T')[0] : "",
        person1Password: "",
        person2Password: "",
      });
    }
  }, [settings, form]);

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    updateSettings({
      data: {
        person1Name: values.person1Name,
        person2Name: values.person2Name,
        loveDate: values.loveDate ? new Date(values.loveDate).toISOString() : null,
        loveMessage: values.loveMessage,
        person1Birthday: values.person1Birthday ? new Date(values.person1Birthday).toISOString() : null,
        person2Birthday: values.person2Birthday ? new Date(values.person2Birthday).toISOString() : null,
        ...(values.person1Password?.trim() ? { person1Password: values.person1Password.trim() } : {}),
        ...(values.person2Password?.trim() ? { person2Password: values.person2Password.trim() } : {}),
      },
    });
  }

  if (!settings) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const name1 = form.watch("person1Name") || "Orang Pertama";
  const name2 = form.watch("person2Name") || "Orang Kedua";

  return (
    <Card className="shadow-sm border-primary/10">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-primary">Pengaturan Web</CardTitle>
        <CardDescription>
          Atur nama, tanggal jadian, ultah, kata sandi, dan pesan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="person1Name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pertama</FormLabel>
                  <FormControl><Input placeholder="Mis. Budi" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="person2Name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kedua</FormLabel>
                  <FormControl><Input placeholder="Mis. Siti" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Love Date */}
            <FormField control={form.control} name="loveDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Jadian (Anniversary)</FormLabel>
                <FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Birthdays */}
            <div className="border border-primary/10 rounded-xl p-4 bg-primary/5 space-y-4">
              <p className="text-sm font-medium text-foreground">Ulang Tahun (untuk countdown)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="person1Birthday" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ultah {name1}</FormLabel>
                    <FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="person2Birthday" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ultah {name2}</FormLabel>
                    <FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Passwords */}
            <div
              className="border rounded-xl p-4 space-y-4"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-primary/60" />
                <p className="text-sm font-medium text-foreground">Kata Sandi Login Owner</p>
              </div>
              <p className="text-[11px] text-white/30">
                Kosongkan jika tidak ingin mengubah.
                Default: <code className="text-white/50">kenangan1</code> (orang pertama) &amp;{" "}
                <code className="text-white/50">kenangan2</code> (orang kedua)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="person1Password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode {name1}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Biarkan kosong = tidak berubah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="person2Password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode {name2}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Biarkan kosong = tidak berubah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Love message */}
            <FormField control={form.control} name="loveMessage" render={({ field }) => (
              <FormItem>
                <FormLabel>Pesan Cinta di Halaman Utama</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tulis pesan manis untuk ditampilkan di halaman utama..."
                    className="resize-none h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating} className="gap-2">
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Pengaturan
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
