-- Update the Rube product with properly formatted schema
UPDATE products 
SET custom_metadata = jsonb_set(
  COALESCE(custom_metadata, '{}'::jsonb),
  '{schema_markup}',
  '{
    "@context": "https://schema.org",
    "@type": "Product",
    "url": "https://yakuzaev.vercel.app/products/rube",
    "description": "Know about Yakuza Rubie Electric scooter in detail like its range, charging, battery, mileage, on road & ex-showroom price etc.",
    "name": "Yakuza Rubie",
    "image": [
      {
        "@type": "ImageObject",
        "url": "https://www.yakuzaev.com/wp-content/uploads/2024/03/Thumbnail-1.jpg",
        "width": "2560",
        "height": "1340"
      },
      {
        "@type": "ImageObject",
        "url": "https://www.yakuzaev.com/wp-content/uploads/2024/03/6-Stunning-Colours.-1000x700-1.jpg",
        "width": "1000",
        "height": "700"
      },
      {
        "@type": "ImageObject",
        "url": "https://www.yakuzaev.com/wp-content/uploads/2024/03/white-color-01.-1000x725-2.jpg",
        "width": "1000",
        "height": "725"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.9,
      "ratingCount": 4448,
      "reviewCount": 2674,
      "worstRating": 1,
      "bestRating": 5
    },
    "additionalProperty": [
      {"@type": "PropertyValue", "name": "Front Brake Type", "value": "Disc"},
      {"@type": "PropertyValue", "name": "Wheel Type", "value": "Alloy"},
      {"@type": "PropertyValue", "name": "Start Type", "value": "Electric Start"},
      {"@type": "PropertyValue", "name": "Charging Time", "value": "6", "unitText": "Hours"},
      {"@type": "PropertyValue", "name": "Mileage", "value": "100", "unitText": "Km/Charge"},
      {"@type": "PropertyValue", "name": "Kerb Weight", "value": "117.2", "unitText": "kg"},
      {"@type": "PropertyValue", "name": "Seat Height", "value": "780", "unitText": "mm"},
      {"@type": "PropertyValue", "name": "Top Speed", "value": "60", "unitText": "Kmph"},
      {"@type": "PropertyValue", "name": "Rear Brake Type", "value": "Drum"}
    ],
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": 35280,
      "highPrice": 44800,
      "offerCount": 1
    },
    "brand": {
      "@type": "Brand",
      "name": "Yakuza EV",
      "url": "https://yakuzaev.vercel.app"
    },
    "model": "Yakuza Rubie",
    "color": ["White", "Grey", "Green", "Red", "Blue", "Black"]
  }'::jsonb
),
updated_at = now()
WHERE slug = 'rube';