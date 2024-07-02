// import sortBy from "sort-by";
import fs from "node:fs";
import { processMarkdown } from "~/md";
import { type ProjectReflection } from "typedoc";

// needs to be deployed
let DATA_PATH = process.cwd() + "/data.json";
// or can import it directly but then TS slows to a crawl for everything
// import api from "../../data.json";

let api = JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as ReturnType<
  ProjectReflection["toObject"]
>;

// let symbolMapByQualifiedName = new Map<string, typeof api.symbolIdMap[number]>();
let symbolMapByQualifiedName = new Map(
  Object.keys(api.symbolIdMap).map(key => {
    let id = Number(key);
    let node = api.symbolIdMap[id];
    return [node.qualifiedName, { node, id }];
  }),
);

export function getTitle() {
  return api.name;
}

function getPackage(pkgName: string) {
  let pkg = api.children?.find(child => child.name === pkgName);
  if (pkg == null) throw new Error("unexpected package name");
  return pkg;
}

export async function getDoc(pkgName: string, qualifiedName: string) {
  let pkg = getPackage(pkgName);
  let symbol = symbolMapByQualifiedName.get(qualifiedName);
  console.log(symbol);
  if (!symbol) return null;
  // let node = pkg.children?.find(child => child.id === symbol.id) || null;
  let node = pkg.children?.find(child => child.name === qualifiedName) || null;
  if (!node) return null;
  return {
    name: node.name,
    signatures: node.signatures
      ? await Promise.all(
          node.signatures.map(async sig => {
            let md = sig.comment
              ? sig.comment.summary.map(s => s.text).join("")
              : null;
            return { html: md ? String(await processMarkdown(md)) : "" };
          }),
        )
      : [],
  };
}

export function getPackagesNames() {
  return api.children.map(child => {
    return {
      name: child.name,
      href: child.name.startsWith("@") ? child.name.split("/")[1] : child.name,
    };
  });
}

export function getPackageNav(name: string) {
  let pkg = api.children.find(child => child.name === name);
  if (!pkg) return null;

  let _categories = pkg.categories ?? pkg.groups ?? [];
  let categories: Category[] = [];

  for (let category of _categories) {
    let c: Category = { title: category.title, children: [] };
    for (let id of category.children) {
      let stringId = id + "";
      c.children.push(api.symbolIdMap[stringId] as SymbolMapNode);
    }
    categories.push(c);
  }

  return {
    name: pkg.name,
    categories: categories,
  };
}
