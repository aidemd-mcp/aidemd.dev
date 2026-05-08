/**
 * Full-width dashed horizontal rule separating walkthrough sections.
 * Matches brain-variant-walkthrough.jsx lines 217–219: padded wrapper,
 * dashed border-top in --color-border.
 * Server component.
 */
export default function Divider() {
  return (
    <div className="px-[64px] py-[4px]">
      <div className="border-t border-dashed border-[color:var(--color-border)]" />
    </div>
  );
}
