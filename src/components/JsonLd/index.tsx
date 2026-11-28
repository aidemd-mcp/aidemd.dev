import serializeJsonLd from '@/service/structuredData/serializeJsonLd';
import type { JsonLdDocument } from '@/types/structuredData';

interface JsonLdProps {
  document: JsonLdDocument;
}

/**
 * The one way a page embeds a structured-data record: a `<script type="application/ld+json">`
 * whose body is the serialized document. Escaping lives in `serializeJsonLd`, never here.
 */
export default function JsonLd({ document }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(document) }}
    />
  );
}
