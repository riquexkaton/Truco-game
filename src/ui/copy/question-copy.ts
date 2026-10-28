import type { Question } from '@application/ports/hud-port';

import { CHALLENGE_PROMPTS } from '@ui/copy/challenge-prompts';
import { CHOICE_PROMPTS } from '@ui/copy/choice-prompts';
import { PACT_PROMPTS } from '@ui/copy/pact-prompts';
import type { PromptBuilders, PromptSpec } from '@ui/copy/prompt';

const PROMPTS: PromptBuilders = { ...CHALLENGE_PROMPTS, ...PACT_PROMPTS, ...CHOICE_PROMPTS };

type AnyPromptBuilder = (question: Question) => PromptSpec<unknown>;

export const promptFor = (question: Question): PromptSpec<unknown> =>
  (PROMPTS[question.kind] as AnyPromptBuilder)(question);
