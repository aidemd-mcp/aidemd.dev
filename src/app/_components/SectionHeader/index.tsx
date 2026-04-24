interface SectionHeaderProps {
  num: string;
  title: string;
}

/**
 * §{num} {title} — accent-green §-number at 14px, title at 22px weight 600.
 * Used as the section heading for each marketing section.
 * Renders an <h2> so every marketing section has a real heading in the outline.
 * margin:0 resets default <h2> block margin so layout is unchanged.
 */
export default function SectionHeader({ num, title }: SectionHeaderProps) {
  return (
    <h2
      className="flex items-baseline gap-[14px] text-[22px] font-semibold text-[color:var(--color-fg)]"
      style={{ margin: 0 }}
    >
      <span aria-hidden="true" className="text-[14px] text-[color:var(--color-accent)]">
        §{num}
      </span>
      {title}
    </h2>
  );
}
