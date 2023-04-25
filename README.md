# README

Rehype plugin that unwraps line breaks from inline elements



## Features

- unwraps a line break `<br>` from an inline element if it's the first or last child
- inline elements currently used: `<em>`, `<span>`, `<strong>`



## Example

Before

```html
<div><span><strong>Lorem ipsum<br></strong></span></div>
```

After

```html
<div><span><strong>Lorem ipsum</strong></span><br></div>
```
