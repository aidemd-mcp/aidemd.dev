export type ExpoPose = 'teach' | 'think' | 'wave' | 'point';

export type SectionId =
  | 'hero'
  | 'threeLayerModel'
  | 'pipeline'
  | 'intentTree'
  | 'vaultBrain'
  | 'cliDemo'
  | 'comparison'
  | 'quickstart'
  | 'footer'
  | 'docs';

export type ExpoTip = {
  pose: ExpoPose;
  title: string;
  body: string;
};
