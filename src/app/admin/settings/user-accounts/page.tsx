// app/admin/settings/user-accounts/page.tsx
import { prisma } from "@/lib/db";
import { updateUserAction, deleteUserAction } from "./actions";
import UserAccountsClient from "./UserAccountsClient";

async function fetchUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function UserAccountsPage() {
  const users = await fetchUsers();

  return (
    <UserAccountsClient
      users={users}
      updateUserAction={updateUserAction}
      deleteUserAction={deleteUserAction}
    />
  );
}
