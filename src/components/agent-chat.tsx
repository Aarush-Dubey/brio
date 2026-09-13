"use client";

import { type FormEvent, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export function AgentChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi — give me a task and I’ll run it through the starter graph." },
  ]);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || pending) return;

    setInput("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setPending(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Agent request failed");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply ?? "No response returned." },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: error instanceof Error ? error.message : "Something went wrong." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 shadow-2xl shadow-cyan-950/30 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm font-medium text-white">Starter agent</p>
          <p className="text-xs text-slate-500">LangGraph workflow</p>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">ready</span>
      </div>
      <div className="flex h-[23rem] flex-col gap-3 overflow-y-auto p-5">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto bg-cyan-400 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-200"
            }`}
          >
            {message.content}
          </div>
        ))}
        {pending && <p className="px-2 text-sm text-slate-500">Agent is thinking…</p>}
      </div>
      <form onSubmit={submit} className="flex gap-3 border-t border-white/10 p-4">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask the agent…"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/60"
        />
        <button
          disabled={pending}
          className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
