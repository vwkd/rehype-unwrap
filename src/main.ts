import { visit } from "../deps.ts";

const INLINE_ELEMENTS = ["em", "span", "strong"];

/**
 * Recursively moves first `br` child of inline element up to parent before itself
 * and last `br` child up to parent after itself until the tree doesn't change anymore
 *
 * Note: can't move child up multiple levels directly because doesn't have reference
 * to ancestors, can only move it up one level at a time.
 */
export default function rehypeUnwrapLinebreak() {
  return (tree) => {
    (function recurse(didChange = true) {
      if (didChange == false) {
        return;
      }

      let hasChanged = false;
      visit(tree, "element", (node, index, parent) => {
        if (
          INLINE_ELEMENTS.includes(node.tagName) &&
          node.children.at(0)?.tagName === "br"
        ) {
          parent.children.splice(index, 0, node.children.shift());
          hasChanged = true;
        } else if (
          INLINE_ELEMENTS.includes(node.tagName) &&
          node.children.at(-1)?.tagName === "br"
        ) {
          parent.children.splice(index + 1, 0, node.children.pop());
          hasChanged = true;
        }
      });

      recurse(hasChanged);
    })();
  };
}
