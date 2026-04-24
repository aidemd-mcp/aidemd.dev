interface SectionHeaderProps {
  num: string;
  title: string;
}

/**
 * §{num} {title} — accent-green §-number at 14px, title at 22px weight 600.
 * Used as the section heading for each marketing section.
 */
export default function SectionHeader({ num, title }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline gap-[14px]">
      <span className="text-[14px] text-[color:var(--color-accent)]">
        §{num}
      </span>
      <span className="text-[22px] font-semibold text-[color:var(--color-fg)]">
        {title}
      </span>
    </div>
  );
}
