import { db } from "../index.ts";
import { eq, count, sum, isNull, and, ne, sql } from "drizzle-orm";
import { urls, clicks } from "../schema/schema.ts";
import { user } from "../schema/auth-schema.ts";
import { desc } from "drizzle-orm";

export async function createUrl(url: typeof urls.$inferInsert) {
    return await db.insert(urls).values(url);
}

export async function getUrl(id: string) {
    return await db.select().from(urls).where(
        and(eq(urls.id, id), isNull(urls.deletedAt))
    );
}

export async function getAllUrls() {
    return await db.select().from(urls).where(isNull(urls.deletedAt));
}

export async function getRecentUrls(limit: number = 3) {
    return await db.select().from(urls)
        .where(isNull(urls.deletedAt))
        .orderBy(desc(urls.createdAt))
        .limit(limit);
}

export async function getUrlByShortCode(shortCode: string) {
    const result = await db.select().from(urls).where(
        and(eq(urls.shortCode, shortCode), isNull(urls.deletedAt))
    ).limit(1);
    return result[0] || null;
}

export async function updateUrl(id: string, url: Partial<typeof urls.$inferInsert>) {
    return await db.update(urls).set(url).where(eq(urls.id, id));
}

export async function deleteUrl(id: string) {
    return await db.update(urls).set({ deletedAt: new Date() }).where(eq(urls.id, id));
}

export async function checkShortCodeExists(shortCode: string, excludeId?: string) {
    const filters = [
        eq(urls.shortCode, shortCode),
        isNull(urls.deletedAt)
    ];
    if (excludeId) filters.push(ne(urls.id, excludeId));
    
    const result = await db.select({ value: count() })
        .from(urls)
        .where(and(...filters));
        
    return Number(result[0]?.value ?? 0) > 0;
}

export async function getDashboardStats() {
    const totalUrlsResult = await db.select({ value: count() }).from(urls).where(isNull(urls.deletedAt));
    const totalClicksResult = await db.select({ value: sum(urls.clicks) }).from(urls).where(isNull(urls.deletedAt));
    const userAktifResult = await db.select({ value: count() }).from(user).where(isNull(user.deletedAt));
    
    const totalUrls = Number(totalUrlsResult[0]?.value ?? 0);
    const totalClicks = Number(totalClicksResult[0]?.value ?? 0);
    
    return {
        totalUrls,
        totalClicks,
        userAktif: Number(userAktifResult[0]?.value ?? 0), 
        clickRate: totalUrls > 0 ? Math.round((totalClicks / totalUrls) * 10) / 10 : 0
    };
}

export async function getTopUsers(limit: number = 3) {
    return await db.select({
        name: user.name,
        urlsCount: count(urls.id),
        totalClicks: sum(urls.clicks)
    })
    .from(user)
    .leftJoin(urls, eq(user.id, urls.userId))
    .where(isNull(user.deletedAt))
    .groupBy(user.id, user.name)
    .orderBy(desc(sql`sum(${urls.clicks})`))
    .limit(limit);
}

export async function recordClick(urlId: string, clickData: { device?: string, browser?: string, ip?: string, location?: string }) {
    // 1. Insert analytics record
    await db.insert(clicks).values({
        urlId,
        ...clickData
    });

    // 2. Increment total clicks in urls table
    await db.update(urls)
        .set({ clicks: sql`${urls.clicks} + 1` })
        .where(eq(urls.id, urlId));
}
