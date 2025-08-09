// app/actions/users.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { registerSchema, type RegisterFormData } from "@/lib/zodSchemas";


const LIST_PATH = "/admin/settings/user-accounts";



// UPDATE
export async function updateUserAction(
  id: string,
  input: Partial<RegisterFormData>
) {
 
}

// DELETE
export async function deleteUserAction(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath(LIST_PATH);
}
