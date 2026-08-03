"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { submitPaymentForm } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const initialState = {
  message: "",
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Processing..." : "Submit Payment"}
    </Button>
  );
}

export function PaymentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(submitPaymentForm, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success!",
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.message && (state.errors && Object.keys(state.errors).length > 0)) {
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
            <CardTitle className="text-2xl font-headline">Payment Details</CardTitle>
            <CardDescription>All transactions are secure. This is a simulation.</CardDescription>
        </CardHeader>
        <CardContent>
            <form ref={formRef} action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input id="invoiceNumber" name="invoiceNumber" placeholder="INV-12345" required aria-describedby="invoice-error" />
                        <div id="invoice-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.invoiceNumber && <p className="text-sm font-medium text-destructive">{state.errors.invoiceNumber[0]}</p>}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="amount">Amount (USD)</Label>
                        <Input id="amount" name="amount" type="number" placeholder="100.00" required step="0.01" aria-describedby="amount-error"/>
                        <div id="amount-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.amount && <p className="text-sm font-medium text-destructive">{state.errors.amount[0]}</p>}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Billing Information</h3>
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" placeholder="Your Name" required aria-describedby="name-error" />
                        <div id="name-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="your@email.com" required aria-describedby="email-error"/>
                        <div id="email-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
                        </div>
                    </div>
                </div>
                
                <SubmitButton />
            </form>
        </CardContent>
    </Card>
  );
}
