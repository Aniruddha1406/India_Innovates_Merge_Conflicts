'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Badge from '@/components/Badge';
import StatusDot from '@/components/StatusDot';

/* ── Node data ── */
const INITIAL_NODES = [
    { id: 'N-01', name: 'Central Sq × Main Blvd', density: 72, corridor: false, emergency: false },
    { id: 'N-02', name: 'Park St × Ring Rd', density: 34, corridor: false, emergency: false },
    { id: 'N-03', name: 'Airport Blvd × NH-4', density: 28, corridor: false, emergency: false },
    { id: 'N-04', name: 'Tech Park × Outer Ring', density: 61, corridor: false, emergency: false },
    { id: 'N-05', name: 'Civil Lines × MG Rd', density: 82, corridor: true, emergency: false },
    { id: 'N-06', name: 'Station Rd × Nehru Nagar', density: 91, corridor: true, emergency: false },
    { id: 'N-07', name: 'MG Road × Park Street', density: 55, corridor: true, emergency: true },
    { id: 'N-08', name: 'Jubilee Hills × NH-65', density: 47, corridor: true, emergency: false },
    { id: 'N-09', name: 'Sec 12 × Residential', density: 18, corridor: false, emergency: false },
    { id: 'N-10', name: 'Old City × Bazaar Rd', density: 78, corridor: false, emergency: false },
    { id: 'N-11', name: 'North Ave × Bypass', density: 43, corridor: false, emergency: false },
    { id: 'N-12', name: 'Outer Ring × Factory Rd', density: 23, corridor: false, emergency: false },
    { id: 'N-13', name: 'High Court × Museum Rd', density: 67, corridor: false, emergency: false },
    { id: 'N-14', name: 'East Gate × Highway 7', density: 52, corridor: false, emergency: false },
    { id: 'N-15', name: 'West End × Lake Blvd', density: 38, corridor: false, emergency: false },
    { id: 'N-16', name: 'Sec 4 × Arterial Rd', density: 84, corridor: false, emergency: false },
    { id: 'N-17', name: 'South Ring × Bypass', density: 29, corridor: false, emergency: false },
    { id: 'N-18', name: 'Commercial St × CBD', density: 95, corridor: false, emergency: false },
    { id: 'N-19', name: 'University Rd × NH-9', density: 41, corridor: false, emergency: false },
    { id: 'N-20', name: 'Industrial × Canal Rd', density: 14, corridor: false, emergency: false },
    { id: 'N-21', name: 'Stadium Rd × Bus Depot', density: 73, corridor: false, emergency: false },
    { id: 'N-22', name: 'Sector 7 × Metro Link', density: 57, corridor: false, emergency: false },
    { id: 'N-23', name: 'Port Rd × Dock Gate', density: 32, corridor: false, emergency: false },
    { id: 'N-24', name: 'City Hospital × Sec 9', density: 48, corridor: false, emergency: false },
];

function densityColor(d) {
    if (d < 40) return 'text-accent-green';
    if (d < 70) return 'text-accent-amber';
    return 'text-accent-red';
}
function densityBorder(d, corridor, emergency) {
    if (emergency) return 'border-accent-red/60 bg-[rgba(255,59,92,0.06)] animate-pulse-border';
    if (corridor) return 'border-accent-cyan/70 bg-[rgba(0,245,255,0.05)] shadow-[0_0_16px_rgba(0,245,255,0.2)]';
    return 'border-white/5 hover:border-accent-cyan/40';
}
function lightState(d) {
    if (d < 40) return { r: false, a: false, g: true };
    if (d < 70) return { r: false, a: true, g: false };
    return { r: true, a: false, g: false };
}

/* ── Mini traffic light dots ── */
function MiniTL({ d }) {
    const { r, a, g } = lightState(d);
    return (
        <div className="absolute top-2 right-2 flex flex-col gap-[3px]">
            <div className={`w-1.5 h-1.5 rounded-full ${r ? 'bg-accent-red shadow-neon-red' : 'bg-white/10'}`} />
            <div className={`w-1.5 h-1.5 rounded-full ${a ? 'bg-accent-amber shadow-neon-amber' : 'bg-white/10'}`} />
            <div className={`w-1.5 h-1.5 rounded-full ${g ? 'bg-accent-green shadow-neon-green' : 'bg-white/10'}`} />
        </div>
    );
}

/* ── Intersection node card ── */
function IntNode({ node, onClick }) {
    return (
        <div
            onClick={() => onClick(node)}
            className={`bg-bg-card border rounded-xl p-2.5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg relative min-h-[90px] flex flex-col justify-between ${densityBorder(node.density, node.corridor, node.emergency)}`}
        >
            <div>
                <div className="text-[0.62rem] font-mono text-text-muted">{node.id}</div>
                <div className="text-[0.7rem] font-semibold leading-snug mt-0.5 pr-4">{node.name}</div>
            </div>
            <div className={`text-[0.78rem] font-extrabold font-mono ${densityColor(node.density)}`}>{node.density}%</div>
            <MiniTL d={node.density} />
        </div>
    );
}

/* ── Sidebar row ── */
function StatRow({ label, value, color = 'text-accent-cyan' }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
            <span className="text-[0.78rem] text-text-secondary">{label}</span>
            <span className={`text-[0.88rem] font-bold font-mono ${color}`}>{value}</span>
        </div>
    );
}

/* ── Flow Chart (canvas) ── */
function FlowChart() {
    const ref = useRef(null);
    const draw = useCallback(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        const data = Array.from({ length: 24 }, (_, i) => 20 + Math.random() * 60 + Math.sin(i * 0.5) * 20);
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0,245,255,0.3)');
        grad.addColorStop(1, 'rgba(0,245,255,0)');
        ctx.beginPath();
        data.forEach((v, i) => { const x = (i / (data.length - 1)) * w, y = h - (v / 100) * h; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath();
        data.forEach((v, i) => { const x = (i / (data.length - 1)) * w, y = h - (v / 100) * h; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.strokeStyle = 'rgba(0,245,255,0.8)'; ctx.lineWidth = 2; ctx.stroke();
    }, []);
    useEffect(() => { draw(); const t = setInterval(draw, 5000); return () => clearInterval(t); }, [draw]);
    return <canvas ref={ref} width={240} height={100} className="w-full" />;
}

/* ── Node detail panel ── */
function NodeDetail({ node, onClose }) {
    if (!node) return null;
    const ns = Math.min(node.density + 10, 99);
    const ew = Math.max(100 - node.density - 10, 5);
    return (
        <div className={`absolute bottom-4 left-4 right-4 bg-[rgba(13,17,23,0.97)] backdrop-blur-xl border border-accent-cyan/30 rounded-xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] transition-all z-20`}>
            <div className="flex justify-between items-start mb-4">
                <div><Badge variant="cyan">{node.id}</Badge><h3 className="mt-1.5 font-bold">{node.name}</h3></div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-br from-accent-green to-[#00cc7a] text-black shadow-neon-green">Activate Corridor</button>
                    <button onClick={onClose} className="px-2 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/5 text-text-muted hover:text-white">✕</button>
                </div>
            </div>
            <div className="grid grid-cols-6 gap-3">
                {[
                    { label: 'N-S Density', value: `${ns}%`, bar: ns, color: 'amber' },
                    { label: 'E-W Density', value: `${ew}%`, bar: ew, color: 'green' },
                ].map(({ label, value, bar, color }) => (
                    <div key={label} className="col-span-2">
                        <div className="text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">{label}</div>
                        <div className="text-base font-bold font-mono mb-1">{value}</div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full progress-fill-${color}`} style={{ width: `${bar}%` }} /></div>
                    </div>
                ))}
                <div><div className="text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Phase</div><div className="text-sm font-bold text-accent-green">N-S GREEN</div></div>
                <div><div className="text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Cycle</div><div className="text-sm font-bold font-mono">{Math.round(15 + node.density * 0.4)}s</div></div>
                <div><div className="text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Camera</div><div className="text-sm font-bold text-accent-green">✓ Online</div></div>
                <div><div className="text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Detections</div><div className="text-sm font-bold font-mono">{(800 + Math.round(node.density * 15)).toLocaleString()}</div></div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [nodes, setNodes] = useState(INITIAL_NODES);
    const [selectedNode, setSelectedNode] = useState(null);
    const [etaSec, setEtaSec] = useState(222);
    const [speed, setSpeed] = useState(68);
    const [toastVisible, setToastVisible] = useState(false);
    const [alerts, setAlerts] = useState([
        { msg: '🚑 Ambulance en route — Node 07 corridor active', time: '14:32:05', color: 'red' },
        { msg: '⚠️ High density — North Ring Road Intersection', time: '14:31:47', color: 'amber' },
        { msg: '📷 Camera CAM-03 degraded signal', time: '14:28:12', color: 'cyan' },
    ]);
    const LANES = [
        { idx: 15, label: 'North Ring Rd' }, { idx: 10, label: 'MG Road' },
        { idx: 2, label: 'Airport Blvd' }, { idx: 11, label: 'Outer Ring Rd' }, { idx: 17, label: 'City Center' },
    ];

    // Live density update
    useEffect(() => {
        const t = setInterval(() => {
            setNodes(prev => prev.map(n => ({ ...n, density: Math.max(5, Math.min(99, n.density + Math.floor(Math.random() * 7) - 3)) })));
        }, 2200);
        return () => clearInterval(t);
    }, []);

    // ETA countdown
    useEffect(() => {
        const t = setInterval(() => {
            setEtaSec(s => Math.max(0, s - 1));
            setSpeed(Math.floor(60 + Math.random() * 20));
        }, 1000);
        return () => clearInterval(t);
    }, []);

    // Toast after 3s
    useEffect(() => { const t = setTimeout(() => setToastVisible(true), 3000); return () => clearTimeout(t); }, []);

    function simulateAlert() {
        const rnd = Math.floor(Math.random() * nodes.length);
        setNodes(prev => prev.map((n, i) => i === rnd ? { ...n, emergency: true } : n));
        setAlerts(prev => [{ msg: `🚑 Visual Override — ${nodes[rnd].id}: Ambulance detected (97.8%)`, time: new Date().toLocaleTimeString(), color: 'red' }, ...prev]);
        setToastVisible(true);
        setTimeout(() => setNodes(prev => prev.map((n, i) => i === rnd ? { ...n, emergency: false } : n)), 8000);
    }

    const etaStr = `${Math.floor(etaSec / 60)}m ${(etaSec % 60).toString().padStart(2, '0')}s`;

    return (
        <div className="bg-bg-deep text-text-primary font-sans h-screen flex flex-col overflow-hidden">
            <div className="grid-bg" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-3 bg-bg-deep/95 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 font-extrabold text-xl no-underline text-white">
                        <div className="w-8 h-8 rounded-[6px] bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center neon-cyan">⬡</div>
                        <span><span className="text-accent-cyan">AURA</span>-GRID</span>
                    </Link>
                    <div className="w-px h-6 bg-white/10" />
                    <span className="text-sm text-text-muted">Live Traffic Control Center</span>
                </div>
                <div className="flex items-center gap-2 bg-accent-green/10 border border-accent-green/20 rounded-full px-3 py-1.5">
                    <StatusDot color="green" /><span className="font-mono text-xs text-text-secondary">LIVE · Updating every 2s</span>
                </div>
                <div className="flex items-center gap-5">
                    {[['Active Corridors', '2', 'text-accent-green'], ['Nodes Online', '24/24', 'text-accent-cyan'], ['Alerts', '3', 'text-accent-red']].map(([l, v, c]) => (
                        <div key={l} className="flex flex-col items-center">
                            <span className="text-[0.62rem] text-text-muted uppercase tracking-wide">{l}</span>
                            <span className={`text-xl font-extrabold font-mono leading-tight ${c}`}>{v}</span>
                        </div>
                    ))}
                    <Link href="/portal" className="inline-flex gap-1.5 items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-br from-accent-cyan to-[#0099cc] text-black no-underline">🔒 Portal</Link>
                    <Link href="/" className="inline-flex gap-1.5 items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 text-text-primary no-underline">← Home</Link>
                </div>
            </header>

            {/* Main 3-col grid */}
            <main className="flex flex-1 overflow-hidden relative z-10">

                {/* LEFT SIDEBAR */}
                <aside className="w-64 bg-[rgba(13,17,23,0.95)] border-r border-white/5 overflow-y-auto p-4 flex flex-col gap-5 flex-shrink-0">
                    {/* Alerts */}
                    <div>
                        <div className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-1.5 mb-2">🚨 Active Alerts</div>
                        <div className="flex flex-col gap-1.5">
                            {alerts.slice(0, 4).map((a, i) => (
                                <div key={i} className={`flex gap-2 p-2.5 rounded-lg border text-xs ${a.color === 'red' ? 'bg-[rgba(255,59,92,0.08)] border-accent-red/20' : a.color === 'amber' ? 'bg-[rgba(255,184,0,0.08)] border-accent-amber/20' : 'bg-[rgba(0,245,255,0.06)] border-accent-cyan/15'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${a.color === 'red' ? 'bg-accent-red' : a.color === 'amber' ? 'bg-accent-amber' : 'bg-accent-cyan'}`} />
                                    <div><div className="leading-snug">{a.msg}</div><div className="font-mono text-[0.65rem] text-text-muted mt-0.5">{a.time}</div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* City stats */}
                    <div>
                        <div className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-1.5 mb-2">📊 City-Wide Stats</div>
                        <div className="flex flex-col">
                            <StatRow label="Avg. Wait Time" value="8.3s" />
                            <StatRow label="Total Vehicles" value="14,203" />
                            <StatRow label="CO₂ Saved" value="2.4 tons" color="text-accent-green" />
                            <StatRow label="Fuel Saved" value="1,840 L" color="text-accent-green" />
                            <StatRow label="Emergency Trips" value="7 today" color="text-accent-red" />
                            <StatRow label="Congestion Index" value="34%" color="text-accent-amber" />
                        </div>
                    </div>
                    {/* Lane densities */}
                    <div>
                        <div className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-1.5 mb-2">🚗 Lane Density (Live)</div>
                        <div className="flex flex-col gap-2.5">
                            {LANES.map(({ idx, label }) => {
                                const d = nodes[idx]?.density ?? 50;
                                const c = d < 40 ? 'progress-fill-green' : d < 70 ? 'progress-fill-amber' : 'progress-fill-red';
                                const tc = d < 40 ? 'text-accent-green' : d < 70 ? 'text-accent-amber' : 'text-accent-red';
                                return (
                                    <div key={label} className="flex items-center gap-2 text-[0.72rem] text-text-secondary">
                                        <span className="w-[80px] flex-shrink-0 truncate">{label}</span>
                                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${c} transition-all duration-700`} style={{ width: `${d}%` }} /></div>
                                        <span className={`w-8 text-right font-bold ${tc}`}>{d}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* CENTER */}
                <section className="flex-1 bg-bg-deep p-4 overflow-hidden flex flex-col relative">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-base font-bold">Intersection Grid — City View</h2>
                            <Badge variant="cyan">24 Nodes</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                            {[['#00ff9d', 'Low <40%'], ['#ffb800', 'Med 40–70%'], ['#ff3b5c', 'High >70%']].map(([c, l]) => (
                                <span key={l} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{l}</span>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2 overflow-y-auto">
                        {nodes.map(node => <IntNode key={node.id} node={node} onClick={setSelectedNode} />)}
                    </div>
                    {selectedNode && <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)} />}
                </section>

                {/* RIGHT SIDEBAR */}
                <aside className="w-72 bg-[rgba(13,17,23,0.95)] border-l border-white/5 overflow-y-auto p-4 flex flex-col gap-5 flex-shrink-0">
                    {/* Corridor tracker */}
                    <div>
                        <div className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-1.5 mb-2">🚑 Active Emergency Corridor</div>
                        <div className="bg-[rgba(0,245,255,0.03)] border border-accent-cyan/15 rounded-xl p-3">
                            <div className="flex flex-wrap gap-1.5 mb-3"><Badge variant="red">🚨 AMBULANCE · AMB-042</Badge><Badge variant="green">ACTIVE</Badge></div>
                            <div className="text-xs font-semibold mb-1">📍 Sector 12 Accident Site</div>
                            <div className="w-0.5 h-4 bg-gradient-to-b from-accent-green to-accent-cyan ml-2 my-1" />
                            <div className="text-xs font-semibold mb-3">🏥 City General Hospital</div>
                            <div className="flex flex-col gap-1.5 mb-3">
                                {[['green', 'Node 05 — Passed ✓', 'done'], ['green', 'Node 06 — Passed ✓', 'done'], ['cyan', 'Node 07 — 🚑 IN TRANSIT', 'active'], ['amber', 'Node 08 — Preparing ⏱', 'prep'], ['gray', 'Node 09 — Queued', 'pending']].map(([c, t, s]) => (
                                    <div key={t} className={`flex items-center gap-2 text-xs py-1 ${s === 'active' ? 'text-accent-cyan font-bold' : s === 'prep' ? 'text-accent-amber' : 'text-text-muted'}`}>
                                        <StatusDot color={c} />{t}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 pt-2 border-t border-white/5">
                                {[['ETA', etaStr, 'text-accent-green'], ['Stops', '0', 'text-accent-green'], ['Speed', `${speed} km/h`, 'text-text-primary']].map(([l, v, c]) => (
                                    <div key={l}><div className="text-[0.62rem] text-text-muted uppercase">{l}</div><div className={`font-bold font-mono text-sm ${c}`}>{v}</div></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Camera feeds */}
                    <div>
                        <div className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-1.5 mb-2">📷 Camera Feeds</div>
                        <div className="flex flex-col gap-2.5">
                            {/* Emergency camera */}
                            <div>
                                <div className="relative h-20 bg-[#050810] border border-accent-cyan/20 rounded-lg overflow-hidden">
                                    <div className="absolute top-1.5 left-2 text-[0.6rem] text-accent-cyan font-mono z-10">CAM-07 · LIVE</div>
                                    <div className="cam-detect-box">Ambulance · 97.2%</div>
                                    <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent animate-scan-fast opacity-50" />
                                </div>
                                <div className="flex justify-between items-center mt-1 text-xs text-text-secondary px-0.5"><span>Node 07 · MG Road</span><Badge variant="red" className="text-[0.6rem]">Override</Badge></div>
                            </div>
                            {/* Normal camera */}
                            <div>
                                <div className="relative h-20 bg-[#050810] border border-accent-green/20 rounded-lg overflow-hidden">
                                    <div className="absolute top-1.5 left-2 text-[0.6rem] text-accent-green font-mono z-10">CAM-12 · LIVE</div>
                                    <div className="absolute bottom-2 left-2 text-[0.62rem] text-accent-green font-mono">Cars ×8 · Bikes ×3</div>
                                    <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-green to-transparent animate-scan opacity-40" />
                                </div>
                                <div className="flex justify-between items-center mt-1 text-xs text-text-secondary px-0.5"><span>Node 12 · Outer Ring</span><Badge variant="green" className="text-[0.6rem]">Normal</Badge></div>
                            </div>
                            {/* Degraded */}
                            <div>
                                <div className="relative h-20 bg-[#0a0705] border border-accent-amber/30 rounded-lg overflow-hidden flex items-center justify-center">
                                    <div className="absolute top-1.5 left-2 text-[0.6rem] text-accent-amber font-mono z-10">CAM-03 · DEGRADED</div>
                                    <span className="text-[0.65rem] text-accent-amber mt-4">⚠ Signal Weak — Fallback Mode</span>
                                </div>
                                <div className="flex justify-between items-center mt-1 text-xs text-text-secondary px-0.5"><span>Node 03 · Airport</span><Badge variant="amber" className="text-[0.6rem]">Fallback</Badge></div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div>
                        <div className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-1.5 mb-2">📈 Traffic Flow (Last 1h)</div>
                        <FlowChart />
                    </div>

                    {/* Quick actions */}
                    <div>
                        <div className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-1.5 mb-2">⚡ Quick Actions</div>
                        <div className="flex flex-col gap-2">
                            <Link href="/portal" className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-br from-accent-green to-[#00cc7a] text-black no-underline">🚑 New Green Corridor</Link>
                            <button onClick={simulateAlert} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 text-text-primary font-sans cursor-pointer hover:bg-white/10">🔔 Simulate Emergency</button>
                            <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 text-text-primary font-sans cursor-pointer hover:bg-white/10">📊 Export Report</button>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Toast */}
            <div className={`toast ${toastVisible ? 'show' : ''}`}>
                <div className="text-2xl">🚨</div>
                <div>
                    <div className="font-bold text-sm">Emergency Override Activated!</div>
                    <div className="text-xs text-text-secondary">Node override active — corridor initiating</div>
                </div>
                <button onClick={() => setToastVisible(false)} className="ml-auto text-text-muted text-lg leading-none bg-transparent border-none cursor-pointer">✕</button>
            </div>
        </div>
    );
}
