import { z } from "zod";

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export type LoginUserInput = z.infer<typeof loginUserSchema>;
