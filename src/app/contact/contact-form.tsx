"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { submitContactForm } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const initialState = {
  message: "",
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(submitContactForm, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success!",
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.message && (state.errors && Object.keys(state.errors).length > 0)) {
      console.error("Contact form submission error:", state.errors);
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl font-headline">Contact Form</CardTitle>
            <CardDescription>We'd love to hear from you.</CardDescription>
        </CardHeader>
        <CardContent>
            <form ref={formRef} action={formAction} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your Name" required aria-describedby="name-error" />
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="your@email.com" required aria-describedby="email-error"/>
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" placeholder="Your message..." rows={5} required aria-describedby="message-error" />
                     <div id="message-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.message && <p className="text-sm font-medium text-destructive">{state.errors.message[0]}</p>}
                    </div>
                </div>
                <SubmitButton />
            </form>
        </CardContent>
    </Card>
  );
}
