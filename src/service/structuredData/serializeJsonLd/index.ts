import type { JsonLdDocument } from '@/types/structuredData';

/**
 * The only way a record becomes the body of a `<script type="application/ld+json">`
 * (`@/components/JsonLd` calls it). Serializes without indentation and replaces every
 * `<` with the six characters `<`, so page text such as `</script>` or `<!--`
 * can never end the script block early; `JSON.parse` restores the text unchanged.
 */
export default function serializeJsonLd(document: JsonLdDocument): string {
  return JSON.stringify(document).replace(/</g, '\\u003c');
}
