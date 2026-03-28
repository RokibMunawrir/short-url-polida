import { db } from "../index";
import { session } from "../schema/auth-schema";
import { eq, desc } from "drizzle-orm";

export const getUserSessions = async (userId: string) => {
    return await db.select()
        .from(session)
        .where(eq(session.userId, userId))
        .orderBy(desc(session.createdAt));
};
