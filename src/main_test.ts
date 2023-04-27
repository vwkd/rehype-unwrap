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

Deno.test("one line break in one strong, single child", async () => {
  const input = "<strong><br></strong>";
  const expected = "<br><strong></strong>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("one line break in one strong, before siblings", async () => {
  const input = "<strong><br>Lorem ipsum</strong>";
  const expected = "<br><strong>Lorem ipsum</strong>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("one line break in one strong, after siblings", async () => {
  const input = "<strong>Lorem ipsum<br></strong>";
  const expected = "<strong>Lorem ipsum</strong><br>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("one line break in two nested strong and span, single child", async () => {
  const input = "<span><strong><br></strong></span>";
  const expected = "<br><span><strong></strong></span>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("one line break in two nested strong and span, before siblings", async () => {
  const input = "<span><strong><br>Lorem ipsum</strong></span>";
  const expected = "<br><span><strong>Lorem ipsum</strong></span>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("one line break in two nested strong and span, after siblings", async () => {
  const input = "<span><strong>Lorem ipsum<br></strong></span>";
  const expected = "<span><strong>Lorem ipsum</strong></span><br>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two line breaks in one strong, single child", async () => {
  const input = "<strong><br><br></strong>";
  const expected = "<br><br><strong></strong>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two line breaks in one strong, before siblings", async () => {
  const input = "<strong><br><br>Lorem ipsum</strong>";
  const expected = "<br><br><strong>Lorem ipsum</strong>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two line breaks in one strong, after siblings", async () => {
  const input = "<strong>Lorem ipsum<br><br></strong>";
  const expected = "<strong>Lorem ipsum</strong><br><br>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two line breaks in two nested strong and span, single child", async () => {
  const input = "<span><strong><br><br></strong></span>";
  const expected = "<br><br><span><strong></strong></span>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two line breaks in two nested strong and span, before siblings", async () => {
  const input = "<span><strong><br><br>Lorem ipsum</strong></span>";
  const expected = "<br><br><span><strong>Lorem ipsum</strong></span>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two line breaks in two nested strong and span, after siblings", async () => {
  const input = "<span><strong>Lorem ipsum<br><br></strong></span>";
  const expected = "<span><strong>Lorem ipsum</strong></span><br><br>";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("root edge case", async () => {
  const input = "foo";
  const expected = "foo";

  const actual = (await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeUnwrap, {
      childTest: (node) => true,
      parentTest: (node) => true,
    })
    .use(rehypeStringify)
    .process(input)).toString();

  assertEquals(actual, expected);
});
