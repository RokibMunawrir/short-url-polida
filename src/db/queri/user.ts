import { db } from "../index.ts";
import { eq, isNull, and } from "drizzle-orm";
import { user } from "../schema/auth-schema";

export async function getAllUsers() {
    return await db.select().from(user).where(isNull(user.deletedAt));
}

export async function getUserById(id: string) {
    const result = await db.select().from(user).where(
        and(eq(user.id, id), isNull(user.deletedAt))
    ).limit(1);
    return result[0] || null;
}

export async function updateUser(id: string, data: Partial<typeof user.$inferInsert>) {
    return await db.update(user).set(data).where(eq(user.id, id));
}

export async function deleteUser(id: string) {
    return await db.update(user).set({ deletedAt: new Date() }).where(eq(user.id, id));
}

export async function checkUsernameExists(username: string, excludeId?: string) {
    const result = await db.select().from(user).where(eq(user.username, username)).limit(1);
    const existingUser = result[0];
    if (existingUser && excludeId && existingUser.id === excludeId) return false;
    return !!existingUser;
}

export async function checkEmailExists(email: string, excludeId?: string) {
    const result = await db.select().from(user).where(eq(user.email, email)).limit(1);
    const existingUser = result[0];
    if (existingUser && excludeId && existingUser.id === excludeId) return false;
    return !!existingUser;
}
