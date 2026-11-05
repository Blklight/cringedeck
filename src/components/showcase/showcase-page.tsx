"use client";

import { useMemo, useState } from "react";

import { LayoutBase } from "@/components/layout-base";
import { categories } from "@/components/showcase/registry";
import { Input } from "@/components/ui/input";

export function ShowcasePage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) =>
            item.name.toLowerCase().includes(q),
          ),
        }))
        .filter((category) => category.items.length > 0),
    [q],
  );

  const total = categories.reduce(
    (acc, category) => acc + category.items.length,
    0,
  );

  return (
    <LayoutBase>
      <div className="mx-auto flex w-full max-w-[1500px] gap-10 px-6 py-10">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col overflow-y-auto pr-2 lg:flex">
          <Input
            aria-label="Buscar componente"
            className="mb-4"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar..."
            value={query}
          />
          <nav className="flex flex-col gap-5 text-sm">
            {filtered.map((category) => (
              <div key={category.id}>
                <p className="mb-1 px-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  {category.title}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {category.items.map((item) => (
                    <li key={item.slug}>
                      <a
                        className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        href={`#${item.slug}`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-12">
            <h1 className="font-bold text-3xl tracking-tight">Componentes</h1>
            <p className="mt-1 text-muted-foreground text-sm">
              {total} componentes base-vega (Base UI).
            </p>
            <Input
              aria-label="Buscar componente"
              className="mt-4 lg:hidden"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar..."
              value={query}
            />
          </header>

          <div className="flex flex-col gap-16">
            {filtered.map((category) => (
              <section
                className="scroll-mt-6"
                id={category.id}
                key={category.id}
              >
                <h2 className="mb-6 border-b pb-2 font-semibold text-xl tracking-tight">
                  {category.title}
                </h2>
                <div className="flex flex-col gap-6">
                  {category.items.map((item) => {
                    const Demo = item.demo;
                    return (
                      <div
                        className="scroll-mt-6 rounded-xl border bg-card p-6"
                        id={item.slug}
                        key={item.slug}
                      >
                        <h3 className="mb-4 font-medium text-sm">
                          {item.name}
                        </h3>
                        <Demo />
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </LayoutBase>
  );
}
