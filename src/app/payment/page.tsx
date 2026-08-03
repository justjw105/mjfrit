import { PaymentForm } from './payment-form';
import { CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Make a Payment | MJ Frit',
  description: 'Submit a payment for a custom commission or other services.',
};

export default function PaymentPage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
            <CreditCard className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline text-primary">Make a Payment</h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Use this form to securely submit a payment for a commissioned piece or other services. 
          Please enter the invoice number and payment amount as discussed.
        </p>
      </div>
      <div className="max-w-xl mx-auto">
        <PaymentForm />
      </div>
    </div>
  );
}
