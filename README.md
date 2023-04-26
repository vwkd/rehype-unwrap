# README

Rehype plugin that unwraps first and last child nodes from parent nodes



## Features

- unwraps a child node from its parent node if it's the first or last child
- child and parent are defined using a [`Test`](https://github.com/syntax-tree/unist-util-is#test)



## Example

To unwrap leading or trailing line breaks `<br>` from `em`, `span` and `strong` elements.

```js
import { unified, rehypeParse, rehypeStringify } from "./deps.ts";
import rehypeUnwrap from "./src/main.ts";

const result = (await unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeUnwrap, {
    childTest: (node) => node?.tagName == "br",
    parentTest: (node) => ["em", "span", "strong"].includes(node?.tagName),
  })
  .use(rehypeStringify)
  .process(`<div><span><strong>Lorem ipsum<br></strong></span></div>`))
  .toString();
console.log(result);
```

Before

```html
<div><span><strong>Lorem ipsum<br></strong></span></div>
```

After

```html
<div><span><strong>Lorem ipsum</strong></span><br></div>
```
