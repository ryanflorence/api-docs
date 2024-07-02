import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDoc } from "~/api/api";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.pkg) throw new Error("no pkg param");
  if (!params.child) throw new Error("no child param");
  let doc = await getDoc(params.pkg, params.child);
  if (!doc)
    throw new Response("Not Found", { status: 404, statusText: "No Doc" });
  return doc;
}

export default function Doc() {
  let doc = useLoaderData<typeof loader>();
  return (
    <div>
      <h2>{doc.name}</h2>
      {doc.signatures.map((sig, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: sig.html }} />
      ))}
    </div>
  );
}
