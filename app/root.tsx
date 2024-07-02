import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import { getPackagesNames, getTitle } from "./api/api";

export async function loader() {
  return {
    title: getTitle(),
    packagesNames: getPackagesNames(),
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full flex flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  let { title, packagesNames } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="p-2 border-b">
        <h1 className="text-3xl py-2">{title}</h1>
        <nav>
          <select className="border rounded p-1">
            {packagesNames.map(pkg => (
              <option>{pkg.name}</option>
            ))}
          </select>
        </nav>
      </div>

      <div className="h-full max-h-full flex-1 flex flex-col">
        <Outlet />
      </div>
    </>
  );
}
