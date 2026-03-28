import type { APIRoute } from 'astro';
import { getUrlByShortCode, recordClick } from '../db/queri/url';

export const GET: APIRoute = async ({ params, request, redirect }) => {
    const { slug } = params;

    if (!slug) {
        return new Response(null, { status: 404 });
    }

    try {
        const urlRecord = await getUrlByShortCode(slug);

        if (!urlRecord || urlRecord.status !== 'Active') {
            // If not found or inactive, we could redirect to a 404 page or home
            return redirect('/?error=not-found', 302);
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

        // Log the click asynchronously (don't block the redirect if possible, 
        // though await is safer to ensure data is saved)
        await recordClick(urlRecord.id, {
            device,
            browser,
            ip: ip.split(',')[0].trim(), // Handle forwarded-for lists
            location: 'Unknown' // GeoIP could be added here later
        });

        // Redirect to original URL
        return redirect(urlRecord.originalUrl, 302);
    } catch (error) {
        console.error('Redirection error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
