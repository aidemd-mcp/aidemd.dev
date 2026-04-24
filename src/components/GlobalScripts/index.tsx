import Script from "next/script";

/**
 * Injects Google Tag Manager via next/script afterInteractive strategy.
 * GA4 is configured inside the GTM container (GTM-M24M4PPV) — this component
 * does not load gtag.js directly; GTM handles that internally.
 *
 * - Returns null when NEXT_PUBLIC_GTM_ID is unset (e.g. local dev, CI without GTM).
 * - Respects standard Do Not Track (Option A): the GTM init snippet is wrapped in a
 *   DNT guard so the container never loads when navigator.doNotTrack === '1'. This
 *   prevents any GTM tag (including GA4) from firing rather than relying on per-tag
 *   DNT logic inside the container.
 *
 * Server component — reads env at build/request time, no "use client" needed.
 */
export default function GlobalScripts() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;

  const initSnippet = `
(function(w,d,s,l,i){
  if(w.navigator&&(w.navigator.doNotTrack==='1'||w.doNotTrack==='1'))return;
  w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');
`.trim();

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {initSnippet}
    </Script>
  );
}
