import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login({ data: values });
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="font-serif text-3xl text-primary">Owner Access</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter the password to manage your memories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} className="bg-background/50 focus-visible:ring-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Unlock Journal"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
