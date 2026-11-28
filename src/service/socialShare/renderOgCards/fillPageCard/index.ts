import type { Page } from 'playwright';
import type { OgCardInput } from '@/types/socialShare';

/**
 * Writes one page's title, path and section into the page card's data slots
 * and checks the title read back is the title given. Text goes in through
 * `textContent`, never markup, so a title can hold any characters.
 *
 * @param args.page - The Playwright Page showing the design source.
 * @param args.card - The page fields the card is drawn from.
 */
export default async function fillPageCard({ page, card }: { page: Page; card: OgCardInput }): Promise<void> {
  const read = await page.evaluate(
    ({ title, path, section }) => {
      const root = document.querySelector('#og-page')!;
      const titleSlot = root.querySelector<HTMLElement>('[data-slot="title"]')!;
      const pathSlot = root.querySelector<HTMLElement>('[data-slot="path"]')!;
      const sectionSlot = root.querySelector<HTMLElement>('[data-slot="section"]')!;
      const sectionRow = root.querySelector<HTMLElement>('[data-slot="section-row"]')!;

      titleSlot.textContent = title;
      titleSlot.style.fontSize = '';
      pathSlot.textContent = path;
      sectionSlot.textContent = section ?? '';
      sectionRow.hidden = section === undefined;
      return titleSlot.textContent;
    },
    { title: card.title, path: card.urlPath, section: card.section },
  );
  if (read !== card.title) {
    throw new Error(`page card for ${card.urlPath} shows "${read}" instead of its title`);
  }
}
