"use client";

import Link from "next/link";
import type { Tab } from "./types";
import { CasesView } from "./cases";
import { CaseDetail } from "./case-detail";
import { PersonaView } from "./persona";
import { ConnectionsView } from "./connections";
import { ControlsView } from "./controls";
import { MetricsView } from "./metrics";
import { MendHeader, WorkspaceStrip } from "./mend";
import { useControl } from "./use-control";

export function Dashboard({tab="cases",caseId}:{tab?:Tab;caseId?:string}) {
  const {snapshot,act,busy,error,loadError,message,refresh,connection,lastSyncedAt,recentTransitions}=useControl();
  return <div className="mend-app"><MendHeader tab={tab}/>
    {snapshot&&<div className="workspace-toolbar"><WorkspaceStrip snapshot={snapshot} connection={connection} lastSyncedAt={lastSyncedAt}/>{snapshot.mode==="demo"?<aside aria-label="Demo mode" className="demo-identity"><span><b>Demo mode</b> · <span>Local demo — simulated integrations</span></span><label>Demo identity<select aria-label="Demo identity" value={snapshot.actor.roles[0]} disabled={busy} onChange={event=>void act("demo_role",{role:event.target.value},"Demo identity changed.")}><option value="engineer">Engineer (demo)</option><option value="marketer">Marketer (demo)</option><option value="admin">Admin (demo)</option></select></label></aside>:<span className="operator-name">{snapshot.actor.name}</span>}</div>}
    <main id="main-content" className={caseId?"ticket-workspace":tab==="cases"?"board-page":tab==="dashboard"?"metrics-page":"settings-page"}>
      {(error||loadError)&&<div className="notice error" role="alert"><div><strong>Action unavailable</strong><p>{error||loadError}</p>{/access|unauthorized/i.test(loadError)&&<Link href="/access">Enter workspace access code</Link>}</div><button className="secondary" onClick={()=>void refresh()}>Retry loading</button></div>}
      {message&&<div className="action-message" role="status">✓ {message}</div>}
      {!snapshot&&!loadError&&<div className="loading-state"><span className="status-dot"/>Connecting to the workspace…</div>}
      {snapshot?.mode==="live"&&!snapshot.actor.roles.length&&<div className="notice"><div><strong>Live workspace setup incomplete</strong><p>Connections lists the remaining integration prerequisites.</p></div><Link href="/connections">View readiness →</Link></div>}
      {snapshot&&tab==="cases"&&!caseId&&<CasesView snapshot={snapshot} act={act} busy={busy} connection={connection} recentTransitions={recentTransitions}/>}
      {snapshot&&caseId&&<CaseDetail snapshot={snapshot} caseId={caseId} act={act} busy={busy}/>}
      {snapshot&&tab==="dashboard"&&<MetricsView snapshot={snapshot}/>}
      {snapshot&&tab==="persona"&&<PersonaView snapshot={snapshot} act={act} busy={busy}/>}
      {snapshot&&tab==="connections"&&<ConnectionsView snapshot={snapshot} act={act} busy={busy} refresh={async()=>{await refresh();}}/>}
      {snapshot&&tab==="controls"&&<ControlsView snapshot={snapshot} act={act} busy={busy}/>}
    </main>
  </div>;
}
