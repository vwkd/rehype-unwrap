import { visitParents } from "../deps.ts";
import type { Element, Plugin, Root } from "../deps.ts";

const INLINE_ELEMENTS = ["em", "span", "strong"];

/**
 * Moves a first child `br` element on a branch of first child inline elements
 * up to the highest ancestor before the branch and a last child `br` element
 * on a branch of last child inline elements up to the highest ancestor after the branch
 */
// todo: handle edge case of `undefined` at root level
const rehypeUnwrapLinebreak: Plugin<[], Root> = () => {
  return (tree) => {
    visitParents(tree, "element", (node, ancestors) => {
      const parent = ancestors.at(-1);

      if (node.tagName == "br" && INLINE_ELEMENTS.includes(parent?.tagName)) {
        if (parent?.children.at(0) === node) {
          const { highestAncestor, index } = highestAncestorAndIndex(
            parent,
            -1,
            ancestors,
            0,
          );

          highestAncestor.children.splice(index, 0, parent.children.shift());
        } else if (parent?.children.at(-1) === node) {
          const { highestAncestor, index } = highestAncestorAndIndex(
            parent,
            -1,
            ancestors,
            -1,
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
): { highestAncestor: Root | Element; index: number } {
  const currentLevel = previousLevel - 1;
  const currentAncestor = ancestors.at(currentLevel);

  if (
    INLINE_ELEMENTS.includes(currentAncestor?.tagName) &&
    currentAncestor?.children.at(position) === previousAncestor
  ) {
    return highestAncestorAndIndex(
      currentAncestor,
      currentLevel,
      ancestors,
      position,
    );
  }

  const index = currentAncestor?.children.indexOf(previousAncestor);

  return { highestAncestor: currentAncestor, index };
}
