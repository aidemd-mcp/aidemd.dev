export type IntentNodeKind = 'dir' | 'intent' | 'plan' | 'todo' | 'code';

export type AidePreview = {
  scope: string;
  intent: string;
  desired: string[];
  undesired: string[];
};

export type IntentNode = {
  name: string;
  kind: IntentNodeKind;
  note?: string;
  preview?: AidePreview;
  children?: IntentNode[];
};
