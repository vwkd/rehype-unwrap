import {
  assertEquals,
  rehypeParse,
  rehypeStringify,
  unified,
} from "../deps.ts";

import rehypeUnwrap from "./main.ts";

const pipeline = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeUnwrap, {
    childTest: (node) => node?.tagName == "br",
    parentTest: (node) => ["em", "span", "strong"].includes(node?.tagName),
  })
  .use(rehypeStringify);

Deno.test("line break in strong, single, one level", async () => {
  const input = "<strong><br></strong>";
  const expected = "<br><strong></strong>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("line break in strong, before text, one level", async () => {
  const input = "<strong><br>Lorem ipsum</strong>";
  const expected = "<br><strong>Lorem ipsum</strong>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("line break in strong, after text, one level", async () => {
  const input = "<strong>Lorem ipsum<br></strong>";
  const expected = "<strong>Lorem ipsum</strong><br>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("line break in strong, single, two level", async () => {
  const input = "<span><strong><br></strong></span>";
  const expected = "<br><span><strong></strong></span>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("line break in strong, before text, two level", async () => {
  const input = "<span><strong><br>Lorem ipsum</strong></span>";
  const expected = "<br><span><strong>Lorem ipsum</strong></span>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("line break in strong, after text, two level", async () => {
  const input = "<span><strong>Lorem ipsum<br></strong></span>";
  const expected = "<span><strong>Lorem ipsum</strong></span><br>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});
