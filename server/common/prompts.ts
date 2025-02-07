import type { TemplateContext } from './template-context';

type PromptName = 'dir' | 'server' | 'aspida';

export type Answers = Partial<Record<PromptName, string>>;

export type Prompt = { name: PromptName; message: string } & (
  | { type: 'list'; choices: { name: string; value: string }[]; default: string }
  | { type: 'input'; default?: undefined }
);

export const cfaPrompts: Prompt[] = [
  {
    name: 'dir',
    message: 'Directory name (create new)',
    type: 'input',
  },
  {
    name: 'server',
    message: 'Server engine',
    type: 'list',
    choices: [
      { name: 'Fastify', value: 'fastify' },
      { name: 'Express', value: 'express' },
    ],
    default: 'fastify',
  },
  {
    name: 'aspida',
    message: 'HTTP client',
    choices: [
      { name: 'Fetch API', value: 'fetch' },
      { name: 'Axios', value: 'axios' },
    ],
    type: 'list',
    default: 'fetch',
  },
];

export const getAllDefaultAnswers = (): Answers => {
  const def: Answers = {};
  cfaPrompts.forEach((prompt) => (def[prompt.name] = prompt.default));
  return def;
};

export const addAllUndefined = (answers: TemplateContext): TemplateContext => {
  const res = { ...answers };

  cfaPrompts.forEach((p) => {
    if (!(p.name in res)) res[p.name] = undefined;
  });

  return res;
};

export const isAnswersValid = (answers: Answers) => {
  return cfaPrompts.every((el): boolean => {
    switch (el.type) {
      case 'list':
        return true;
      case 'input':
        return !!answers[el.name];
      default:
        throw new Error(el satisfies never);
    }
  });
};
