import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import remarkgfm from "remark-gfm";

let processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(remarkgfm)
  .use(rehypePrettyCode, {
    // See Options section below.
  })
  .use(rehypeStringify);

export async function processMarkdown(md: string) {
  return processor.process(md);
}
