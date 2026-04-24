export type DemoLine =
  | { prompt: true; text: string }
  | { out: string }
  | { aide: true; path: string }
  | { plan: true; path: string };
