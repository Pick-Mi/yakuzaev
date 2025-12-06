-- Fix invalid schema_json for Home page
UPDATE page_seo_settings 
SET schema_json = '{"@context": "https://schema.org", "@type": "WebSite", "name": "Yakuza EV", "description": "Leading electric scooter manufacturer providing innovative and sustainable mobility solutions", "url": "https://yakuzaev.vercel.app"}'::jsonb,
    updated_at = now()
WHERE id = 'f7912883-bb0d-4781-875b-3e174e808a99';

-- Fix invalid schema_json for Products page
UPDATE page_seo_settings 
SET schema_json = '{"@context": "https://schema.org", "@type": "CollectionPage", "name": "Electric Scooters", "description": "Browse our range of electric scooters"}'::jsonb,
    updated_at = now()
WHERE id = '778a682a-2276-410a-b9fd-0fbbf510ff3d';