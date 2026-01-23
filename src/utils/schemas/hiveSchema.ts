import { z } from "zod";

export const HiveSchema = z.object({
  hiveNumber: z.number().int().positive().max(500),
  strength: z.number().min(1).max(10),
  queenStatus: z.enum(["present", "absent", "unknown"]),
  honey: z.number().min(0).max(100),
});
export type HiveData = z.infer<typeof HiveSchema>;
