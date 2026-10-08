import { describe, expect, it } from "vitest";
import { checkoutSchema } from "@/lib/validation/schemas";

const order = {
  fullName: "Aylee Customer",
  email: "customer@example.com",
  phone: "0300 1234567",
  address: "House 1, Main Street",
  city: "Lahore",
  country: "Pakistan",
  payment: "COD",
  lines: [{ productId: "1", size: "M", color: "Black", quantity: 1 }],
};

describe("checkout contact validation", () => {
  it("requires a valid email address", () => {
    expect(
      checkoutSchema.safeParse({ ...order, email: undefined }).success,
    ).toBe(false);
    for (const email of ["", "not-an-email", "  "]) {
      expect(checkoutSchema.safeParse({ ...order, email }).success).toBe(false);
    }
  });

  it("requires a valid Pakistani mobile number", () => {
    expect(
      checkoutSchema.safeParse({ ...order, phone: undefined }).success,
    ).toBe(false);
    for (const phone of ["", "abcdefghijk", "0300123456", "04001234567"]) {
      expect(checkoutSchema.safeParse({ ...order, phone }).success).toBe(false);
    }
  });

  it("accepts local and international mobile formats", () => {
    for (const phone of ["0300 1234567", "+92 300 1234567", "923001234567"]) {
      expect(checkoutSchema.safeParse({ ...order, phone }).success).toBe(true);
    }
  });
});
