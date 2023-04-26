import { visitParents } from "../deps.ts";

const INLINE_ELEMENTS = ["em", "span", "strong"];

/**
 * Moves a first child `br` element on a branch of first child inline elements
 * up to the highest ancestor before the branch and a last child `br` element
 * on a branch of last child inline elements up to the highest ancestor after the branch
 */
export default function rehypeUnwrapLinebreak() {
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
}

/**
 * Recursively walks up to find highest ancestor
 * decrease level each time
 *
 * Note: uses tail call recursion
 */
function highestAncestorAndIndex(
  previousAncestor,
  previousLevel,
  ancestors,
  position,
) {
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
