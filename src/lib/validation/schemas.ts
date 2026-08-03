import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(20),
  address: z.string().trim().min(8, "Enter your complete address").max(250),
  address2: z.string().trim().max(250).optional(),
  city: z.string().trim().min(2, "Enter your city").max(80),
  postCode: z.string().trim().max(20).optional(),
  country: z.literal("Pakistan"),
  payment: z.enum(["COD", "JAZZCASH", "EASYPAISA", "CARD"]),
  note: z.string().trim().max(500).optional(),
  lines: z
    .array(
      z.object({
        productId: z.string().min(1),
        size: z.string().max(50),
        color: z.string().max(50),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Your bag is empty"),
});

export const checkoutFormSchema = checkoutSchema.omit({ lines: true });

export const accountSchema = z.object({
  mode: z.enum(["login", "register"]),
  name: z.string().trim().max(100).optional(),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
