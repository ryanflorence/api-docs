import { LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getPackageNav } from "~/api/api";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.pkg) throw new Error("dumb");
  let pkg = getPackageNav(params.pkg);
  if (!pkg) throw new Response(null, { status: 404 });
  return pkg;
}

export default function Pkg() {
  let pkg = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full max-h-full">
      <div className="border-r h-full max-h-full overflow-auto flex-shrink">
        <ul className="px-4">
          {pkg.categories.map(category => (
            <li key={category.title}>
              <div className="font-bold mt-6">{category.title}</div>
              {category.children.map(child => (
                <NavLink
                  className={({ isActive }) =>
                    [
                      "block hover:underline focus:underline",
                      isActive ? "text-red-500" : "",
                    ].join(" ")
                  }
                  to={child.qualifiedName}
                >
                  {child.qualifiedName}
                </NavLink>
              ))}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
