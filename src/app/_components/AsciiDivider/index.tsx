/** Full-width dashed horizontal rule between marketing sections. */
export default function AsciiDivider() {
  return (
    <div
      className="px-[64px] py-[6px]"
      role="separator"
      aria-hidden="true"
    >
      <div className="border-t border-dashed border-[color:var(--color-border)]" />
    </div>
  );
}
