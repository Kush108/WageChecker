import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://wagechecker.ca', priority: 1 },
    { url: 'https://wagechecker.ca/check', priority: 0.8 },
  ]
}