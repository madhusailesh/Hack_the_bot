import {z} from "zod";

export const registerSchema = z.object({
    name:z.string().nonempty("Name cannot be empty").min(3,{message:"Name must contain atleast 3 characters."}),
    regdNo:z.string().nonempty("Registration number cannot be empty").min(10,{message:"Enter Valid registration number."}).max(10,{message:"Enter Valid Registration number"})
});

export type registerSchemaType = z.infer<typeof registerSchema>;
