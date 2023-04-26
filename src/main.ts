import { is, visitParents } from "../deps.ts";
import type { Element, Plugin, Root, Test } from "../deps.ts";

interface Options {
  childTest: Test;
  parentTest: Test;
}

/**
 * Moves a first child node on a branch of first child nodes
 * up to the highest ancestor before the branch and a last child node
 * on a branch of last child nodes up to the highest ancestor after the branch
 */
// todo: handle edge case of `undefined` at root level
const rehypeUnwrapLinebreak: Plugin<[Options?], Root> = (args) => {
  if (!args) {
    throw new Error(`Missing arguments.`);
  }

  const { childTest, parentTest } = args;

  return (tree) => {
    visitParents(tree, childTest, (node, ancestors) => {
      const parent = ancestors.at(-1);

      if (is(parent, parentTest)) {
        if (parent?.children.at(0) === node) {
          const { highestAncestor, index } = highestAncestorAndIndex(
            parent,
            -1,
            ancestors,
            0,
            parentTest,
          );

          highestAncestor.children.splice(index, 0, parent.children.shift());
        } else if (parent?.children.at(-1) === node) {
          const { highestAncestor, index } = highestAncestorAndIndex(
            parent,
            -1,
            ancestors,
            -1,
            parentTest,
          );

          highestAncestor.children.splice(index + 1, 0, parent.children.pop());
        }
      }
    });
  };
};

export default rehypeUnwrapLinebreak;

/**
 * Recursively walks up to find highest ancestor
 * decrease level each time
 *
 * Note: uses tail call recursion
 */
// todo: handle edge case of `undefined` at root level
function highestAncestorAndIndex(
  previousAncestor: Root | Element,
  previousLevel: number,
  ancestors: (Root | Element)[],
  position: 0 | -1,
  parentTest: Test,
): { highestAncestor: Root | Element; index: number } {
  const currentLevel = previousLevel - 1;
  const currentAncestor = ancestors.at(currentLevel);

  if (
    is(currentAncestor, parentTest) &&
    currentAncestor?.children.at(position) === previousAncestor
  ) {
    return highestAncestorAndIndex(
      currentAncestor,
      currentLevel,
      ancestors,
      position,
      parentTest,
    );
  }

  const index = currentAncestor?.children.indexOf(previousAncestor);

  return { highestAncestor: currentAncestor, index };
}
