/**
 * The facts of one click on a link inside a docs page body, read off the DOM event and the anchor, so the navigation decision needs no DOM.
 */
export type LinkClick = {
  /** Whether another handler already called `preventDefault` on the click event. */
  defaultPrevented: boolean;
  /** The mouse button of the click event; `0` is the primary button. */
  button: number;
  /** Whether the meta (cmd) key was held. */
  metaKey: boolean;
  /** Whether the ctrl key was held. */
  ctrlKey: boolean;
  /** Whether the shift key was held. */
  shiftKey: boolean;
  /** Whether the alt key was held. */
  altKey: boolean;
  /** The anchor's raw `target` attribute; null when the anchor has none. */
  target: string | null;
  /** Whether the anchor has a `download` attribute. */
  download: boolean;
  /** The anchor's raw `href` attribute as written (not the resolved `anchor.href` property); null when absent. */
  href: string | null;
  /** The page's origin, `window.location.origin`. */
  origin: string;
};
