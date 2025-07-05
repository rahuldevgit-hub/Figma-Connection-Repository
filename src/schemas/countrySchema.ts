import { z } from "zod";

export const countrySchema = z.object({
  name: z.string().min(1, "Country name is required"),
  words: z.string().regex(/^\d+$/, "Country code must be a number"),
});

export type CountryFormValues = z.infer<typeof countrySchema>;
