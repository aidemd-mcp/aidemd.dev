export type PipelineStage = {
  id: 'spec' | 'research' | 'synthesize' | 'plan' | 'build' | 'qa';
  cmd: string;
  name: string;
  role: string;
  reads: string[];
  writes: string[];
  detail: string;
};
