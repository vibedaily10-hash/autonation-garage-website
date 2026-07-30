# AutoNation Garage Website

Static multi-page website for AutoNation vehicle care, services, and parts enquiries in Nairobi.

Production domain: `https://autonationgarage.com`

## Structure

- `index.html`: homepage
- `services.html`: service catalogue
- `marketplace.html`: parts marketplace
- `privacy.html` and `terms.html`: legal pages
- `404.html`: static not-found page
- `styles.css` and `script.js`: production styles and interactions
- `assets/`: production image assets
- `favicon.ico`, `site.webmanifest`, and `assets/icons/`: browser and device branding
- `_headers`: Cloudflare Pages security and caching rules
- `robots.txt` and `sitemap.xml`: crawler configuration

## Local Preview

No build step or package installation is required. From the project root, run:

```powershell
python -m http.server 8765
```

Then open `http://127.0.0.1:8765/index.html`. Directly opening HTML files with a `file:` URL can block embedded Google Maps because browsers isolate local files.

## Deployment

- Intended host: Cloudflare Pages
- Root directory: project root
- Build command: none
- Output directory: project root
- Environment variables: none
- SPA fallback: none; this is a multi-page site

The included `_headers` file provides a CSP, clickjacking protection, privacy-focused browser permissions, MIME sniffing protection, and conservative caching for unversioned assets. Validate these headers again on the final HTTPS domain before launch. HSTS is intentionally omitted until HTTPS and domain ownership are confirmed.

## Analytics And Enquiries

Plausible analytics loads only on `autonationgarage.com` and `www.autonationgarage.com`. The Plausible dashboard must also be configured for `autonationgarage.com`. The site has no form backend; service bookings and product orders use phone, email, and WhatsApp links.

Recommended analytics events after deployment: primary booking CTA, phone click, email click, WhatsApp click, service-page visit, and marketplace order click.

## Images

The hero uses WebP images with the first image preloaded and later slides lazy-loaded. Below-the-fold images should remain lazy-loaded. New workshop photos should be resized close to their rendered dimensions and exported to WebP before being added.

## Browser Support

The site targets current Chrome, Edge, Firefox, Safari, Chrome for Android, and Safari for iOS. It uses progressive fallbacks for viewport units, reduced motion, and content reveal behavior.

## Manual Launch Checks

- Confirm all business contact details, operating hours, and legal wording with the site owner.
- Confirm rights or licences for workshop photos, vehicle imagery, Font Awesome, Google Fonts, and third-party brand marks.
- Verify the production CSP, caching headers, analytics requests, embedded map, canonical URLs, and social preview image on the live domain.
- Submit `sitemap.xml` to the relevant search-engine webmaster tools after launch.
- Have the privacy policy and terms reviewed by the site owner or a qualified legal professional.
