import { AgentChat } from "@/components/agent-chat";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-10 sm:px-10 sm:py-16">
      <div className="mb-10 flex items-center gap-3 text-sm text-slate-400">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_#34d399]" />
        Next.js · Convex · LangGraph
      </div>
      <section className="grid flex-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Agent starter</p>
          <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl">
            Build agents that remember.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            A minimal full-stack base with a LangGraph workflow, a reactive Convex data model, and a polished Next.js interface.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs text-slate-300">
            {["App Router", "TypeScript", "Reactive backend", "Agent graph"].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{item}</span>
            ))}
          </div>
        </div>
        <AgentChat />
      </section>
    </main>
  );
}
