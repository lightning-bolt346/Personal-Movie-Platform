export function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  // If it's an array, we wrap it in a @graph object, which is the standard way to serve multiple schemas in one script
  const structuredData = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : data;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
