import type { APIRoute } from 'astro';
import { getUrlByShortCode, recordClick } from '../db/queri/url';

export const prerender = false;

export const GET: APIRoute = async ({ params, request, redirect }) => {
    const { slug } = params;

    if (!slug) {
        return redirect('/not-found', 302);
    }

    try {
        const urlRecord = await getUrlByShortCode(slug);

        if (!urlRecord) {
            return redirect('/not-found', 302);
        }

        if (urlRecord.status === 'Archived') {
            return redirect('/inactive', 302);
        }

        if (urlRecord.status !== 'Active') {
            return redirect('/inactive', 302);
        }

        // Basic Analytics Extraction
        const userAgent = request.headers.get('user-agent') || '';
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
        
        // Very basic device/browser detection logic
        let device = 'Desktop';
        if (/mobile/i.test(userAgent)) device = 'Mobile';
        if (/tablet/i.test(userAgent)) device = 'Tablet';

        let browser = 'Other';
        if (/chrome|crios/i.test(userAgent)) browser = 'Chrome';
        else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
        else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) browser = 'Safari';
        else if (/edg/i.test(userAgent)) browser = 'Edge';

        // Log the click asynchronously
        await recordClick(urlRecord.id, {
            device,
            browser,
            ip: ip.split(',')[0].trim(),
            location: 'Unknown'
        });

        // Detect Social Bots for OG Preview
        const isBot = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot/i.test(userAgent);

        if (isBot) {
            const title = urlRecord.ogTitle || urlRecord.title || 'Short URL';
            const description = urlRecord.ogDescription || '';
            const image = urlRecord.ogImage || '';
            
            return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${request.url}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta http-equiv="refresh" content="0; url=${urlRecord.originalUrl}" />
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb;">
    <div style="text-align: center; padding: 2rem; background: white; border-radius: 1rem; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <p style="color: #4b5563; font-weight: 600;">Redirecting you to</p>
        <a href="${urlRecord.originalUrl}" style="color: #2563eb; font-weight: 700; text-decoration: none; word-break: break-all;">${urlRecord.originalUrl}</a>
    </div>
    <script>window.location.href = "${urlRecord.originalUrl}";</script>
</body>
</html>`, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // Redirect to original URL for normal users
        return redirect(urlRecord.originalUrl, 302);
    } catch (error) {
        console.error('Redirection error:', error);
        return redirect('/not-found', 302);
    }
};
