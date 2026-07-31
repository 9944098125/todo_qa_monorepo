export interface GeneratorOptions {
  name: string;
  target?: string;
  feature?: string;
  shared?: boolean;
  force?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
}

export interface PromptDefinition {
  type: 'input' | 'confirm' | 'list';
  name: string;
  message: string;
  default?: any;
  choices?: string[] | { name: string; value: string }[];
  when?: (answers: any) => boolean;
  validate?: (input: string) => boolean | string;
}

export interface Generator {
  name: string;
  description: string;
  prompts: PromptDefinition[];
  run: (options: GeneratorOptions, answers: Record<string, any>) => Promise<void>;
}

export interface GenerateContext {
  cwd: string;
  dryRun: boolean;
  force: boolean;
  verbose: boolean;
}
