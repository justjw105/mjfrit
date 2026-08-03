"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors and try again.",
      success: false,
    };
  }

  // In a real app, you would send an email or save to a database here.
  // For this example, we'll just log the data.
  console.log("Contact form submitted successfully:");
  console.log(validatedFields.data);

  return {
    success: true,
    message: "Thank you for your message! We will get back to you shortly.",
    errors: {},
  };
}

const paymentSchema = z.object({
  invoiceNumber: z.string().min(1, { message: "Invoice number is required." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

export async function submitPaymentForm(prevState: any, formData: FormData) {
    const validatedFields = paymentSchema.safeParse({
        invoiceNumber: formData.get('invoiceNumber'),
        amount: formData.get('amount'),
        name: formData.get('name'),
        email: formData.get('email'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the errors and try again.",
            success: false,
        };
    }

    console.log("Payment form submitted successfully (simulation):");
    console.log(validatedFields.data);

    // This is where you would integrate with a payment processor like Stripe.
    // We are just simulating success here.

    return {
        success: true,
        message: "Your payment has been successfully processed. Thank you!",
        errors: {},
    };
}
