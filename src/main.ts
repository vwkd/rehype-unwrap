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
const rehypeUnwrap: Plugin<[Options?], Root> = (args) => {
  if (!args) {
    throw new Error(`rehype-unwrap: missing arguments.`);
  }

  const { childTest, parentTest } = args;

  return (tree) => {
    visitParents(tree, childTest, (node, ancestors) => {
      const parent = ancestors?.at(-1);

      // `is` returns `false` if `parent` is `undefined`
      if (is(parent, parentTest)) {
        if (parent!.children.at(0) === node) {
          const { highestAncestor, index } = highestAncestorAndIndex(
            parent!,
            -1,
            ancestors,
            0,
            parentTest,
          );

          highestAncestor.children.splice(index, 0, parent!.children.shift()!);
          // todo: return `SKIP` to skip deleted part of tree?
        } else if (parent!.children.at(-1) === node) {
          const { highestAncestor, index } = highestAncestorAndIndex(
            parent!,
            -1,
            ancestors,
            -1,
            parentTest,
          );

          highestAncestor.children.splice(
            index + 1,
            0,
            parent!.children.pop()!,
          );
          // todo: return `SKIP` to skip deleted part of tree?
        }
      }
    });
  };
};

export default rehypeUnwrap;

/**
 * Recursively walks up to find highest ancestor
 * decrease level each time
 *
 * Note: uses tail call recursion
 */
function highestAncestorAndIndex(
  previousAncestor: Root | Element,
  previousLevel: number,
  ancestors: (Root | Element)[],
  position: 0 | -1,
  parentTest: Test,
): { highestAncestor: Root | Element; index: number } {
  const currentLevel = previousLevel - 1;
  const currentAncestor = ancestors.at(currentLevel);

  // `is` returns `false` if `currentAncestor` is `undefined`
  if (
    is(currentAncestor, parentTest) &&
    currentAncestor!.children.at(position) === previousAncestor
  ) {
    return highestAncestorAndIndex(
      currentAncestor!,
      currentLevel,
      ancestors,
      position,
      parentTest,
    );
  }

  // edge case where every ancestor satisfied parentTest and reached root
  if (!currentAncestor) {
    return { highestAncestor: previousAncestor, index: position };
  }

  // @ts-ignore infers `indexOf(searchElement: ElementContent, ...)` instead of
  // `indexOf(searchElement: RootContent | ElementContent, ...)`, seems that
  // `RootChildren` is not properly typed as extension of `ElementChildren`
  const index = currentAncestor.children.indexOf(previousAncestor);

  return { highestAncestor: currentAncestor, index };
}
