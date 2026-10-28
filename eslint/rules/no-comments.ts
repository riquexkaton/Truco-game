import type { Rule } from 'eslint';

type Comment = ReturnType<Rule.RuleContext['sourceCode']['getAllComments']>[number];

const isReferenceDirective = (comment: Comment): boolean =>
  comment.type === 'Line' && comment.value.startsWith('/ <reference ');

export const noComments: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow code comments; only triple-slash reference directives pass.' },
    messages: { forbidden: 'Comments are not allowed. Express intent with names and types.' },
    schema: [],
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (!isReferenceDirective(comment) && comment.loc) {
            context.report({ loc: comment.loc, messageId: 'forbidden' });
          }
        }
      },
    };
  },
};
