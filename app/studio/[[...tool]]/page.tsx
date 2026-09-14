import type { Metadata } from "next";
import { Studio } from "@/components/Studio";
import { sanityConfigured } from "@/sanity/env";

export const metadata: Metadata = {
  title: "Studio - AI Society Vienna",
  robots: { index: false },
};

export const dynamic = "force-static";

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="glass max-w-lg rounded-2xl p-10">
          <p className="font-mono text-[11px] tracking-[0.25em] text-neon">
            [ STUDIO NOT CONFIGURED ]
          </p>
          <h1 className="font-display mt-4 text-2xl font-bold text-ink">
            Connect your Sanity project
          </h1>
          <ol className="mt-5 flex list-decimal flex-col gap-3 pl-5 text-sm leading-relaxed text-mist">
            <li>
              Create a free project at{" "}
              <span className="text-ink">sanity.io/manage</span> and copy its
              Project ID.
            </li>
            <li>
              Create <span className="text-ink">.env.local</span> in the
              project root (see{" "}
              <span className="text-ink">.env.local.example</span>) and paste
              the ID into{" "}
              <span className="text-ink">NEXT_PUBLIC_SANITY_PROJECT_ID</span>.
            </li>
            <li>
              In sanity.io/manage → API → CORS origins, add{" "}
              <span className="text-ink">http://localhost:3000</span> (allow
              credentials).
            </li>
            <li>Restart the dev server and reload this page.</li>
          </ol>
        </div>
      </main>
    );
  }

  return <Studio />;
}
