/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Answers } from 'common/prompts';
import { cfaPrompts, isAnswersValid } from 'common/prompts';
import type { DbContext } from 'tests/database/context';
import { randChoice } from 'tests/random';

export const createRandomAnswers = async (dbCtx: DbContext, num = 0): Promise<Answers> => {
  if (num === 1000) throw new Error('Infinite loop');
  const ans: Answers = {};

  // Choice
  cfaPrompts.forEach((p) => {
    (ans as any)[p.name] = p.default;
    if (p.type === 'list') {
      (ans as any)[p.name] = randChoice(p.choices.map((choice) => choice.value));
    } else {
      // To pass the non-empty check
      (ans as any)[p.name] = 'test-foo';
    }
  });

  if (process.env.TEST_CFA_FIX_SERVER) ans.server = process.env.TEST_CFA_FIX_SERVER;

  if (process.env.TEST_CFA_FIX_ASPIDA) ans.aspida = process.env.TEST_CFA_FIX_ASPIDA;

  if (!isAnswersValid(ans)) return await createRandomAnswers(dbCtx, num + 1);

  await dbCtx.up();
  await dbCtx.createNew();

  return ans;
};
