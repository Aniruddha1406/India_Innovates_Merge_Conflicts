'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Badge from '@/components/Badge';
import StatusDot from '@/components/StatusDot';
import CorridorStatusBox from '@/components/CorridorStatusBox';
import YoloFailsafePanel from '@/components/YoloFailsafePanel';
import { CITY_NODES } from '@/lib/cityNodes';

/* ── Build node rows from real city intersection data ── */
function buildCityNodes(cityName) {
    const cityNodes = CITY_NODES[cityName] || CITY_NODES['Delhi'];
    // For display purposes give each node a seeded density
    const seed = cityName.charCodeAt(0) + cityName.length;
    return cityNodes.map((n, i) => ({
        id: `N-${String(i + 1).padStart(2, '0')}`,
        realId: n.id,
        name: n.name,
        density: ((seed * 31 + i * 17 + 19) % 80) + 12,  // deterministic 12–91%
        corridor: i < 2,          // first 2 nodes treated as corridor-active demo
        emergency: i === 1,       // second node has emergency badge
    }));
}

/* ── City-specific lane names ── */
const CITY_LANES = {
    Delhi: ['Ring Road', 'MG Road', 'NH-48 (Airport)', 'Outer Ring Rd'],
    Mumbai: ['Western Express Hwy', 'Eastern Express Hwy', 'Andheri-Kurla Rd', 'SV Road'],
    Bengaluru: ['Outer Ring Rd', 'Hosur Road', 'Bellary Road', 'Mysore Road'],
    Hyderabad: ['Inner Ring Rd', 'Outer Ring Rd', 'NH-65', 'Nehru Outer Ring'],
    Chennai: ['Anna Salai', 'GST Road', 'OMR', 'Inner Ring Road'],
    Pune: ['FC Road', 'Pune-Mumbai Hwy', 'Satara Road', 'Solapur Road'],
    Kolkata: ['VIP Road', 'EM Bypass', 'Park Street', 'Jessore Road'],
    Ahmedabad: ['SG Highway', 'Ring Road', 'Ashram Road', 'SP Ring Road'],
};
function getCityLanes(cityName) {
    return (CITY_LANES[cityName] || CITY_LANES['Delhi']);
}

function densityColor(d) {
    if (d < 40) return 'text-accent-green';
    if (d < 70) return 'text-accent-amber';
    return 'text-accent-red';
}
function densityBarColor(d) {
    if (d < 40) return 'progress-fill-green';
    if (d < 70) return 'progress-fill-amber';
    return 'progress-fill-red';
}

/* ── Compact Node row ── */
function NodeRow({ node, onClick }) {
    const dot = node.density < 40 ? 'bg-accent-green' : node.density < 70 ? 'bg-accent-amber' : 'bg-accent-red';
    return (
        <div
            onClick={() => onClick(node)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${node.emergency ? 'border-accent-red/30 bg-accent-red/[0.03] hover:border-accent-red/50' : node.corridor ? 'border-accent-cyan/25 bg-accent-cyan/[0.02] hover:border-accent-cyan/40' : 'border-white/5 bg-white/[0.01] hover:border-white/15'}`}
        >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
            <span className="text-[0.65rem] font-mono text-text-muted w-10 flex-shrink-0">{node.id}</span>
            <span className="flex-1 text-[0.74rem] font-medium text-text-secondary truncate">{node.name}</span>
            {node.corridor && <span className="text-[0.55rem] font-bold text-accent-cyan border border-accent-cyan/30 rounded-full px-1.5 py-0.5 flex-shrink-0">COR</span>}
            {node.emergency && <span className="text-[0.55rem] font-bold text-accent-red border border-accent-red/30 rounded-full px-1.5 py-0.5 flex-shrink-0">EMG</span>}
            <span className={`text-[0.78rem] font-black font-mono flex-shrink-0 ${densityColor(node.density)}`}>{node.density}%</span>
            <div className="w-14 h-1 bg-white/5 rounded-full overflow-hidden flex-shrink-0">
                <div className={`h-full rounded-full ${densityBarColor(node.density)} transition-all duration-700`} style={{ width: `${node.density}%` }} />
            </div>
        </div>
    );
}

/* ── Node Detail Panel (slide-up) ── */
function NodeDetail({ node, onClose }) {
    if (!node) return null;
    const ns = Math.min(node.density + 10, 99);
    const ew = Math.max(100 - node.density - 10, 5);
    return (
        <div className="absolute inset-x-0 bottom-0 bg-[rgba(13,17,23,0.98)] backdrop-blur-xl border-t border-accent-cyan/20 rounded-t-2xl p-5 z-20 shadow-[0_-12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="cyan">{node.id}</Badge>
                        {node.corridor && <Badge variant="green">Corridor Active</Badge>}
                        {node.emergency && <Badge variant="red">Emergency</Badge>}
                    </div>
                    <h3 className="font-bold text-base">{node.name}</h3>
                </div>
                <div className="flex gap-2">
                    <Link href="/portal" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent-cyan text-black no-underline">Activate Corridor</Link>
                    <button onClick={onClose} className="px-2.5 py-1.5 rounded-lg text-xs bg-white/5 text-text-muted hover:text-white font-sans cursor-pointer">✕</button>
                </div>
            </div>

            {/* Traffic flow bars */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {[['N-S Flow', ns, 'amber'], ['E-W Flow', ew, 'green']].map(([label, val, color]) => (
                    <div key={label}>
                        <div className="flex justify-between text-xs mb-1.5"><span className="text-text-muted">{label}</span><span className="font-bold font-mono">{val}%</span></div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full progress-fill-${color}`} style={{ width: `${val}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Real-time density gauge */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5"><span className="text-text-muted">Traffic Density</span><span className={`font-bold font-mono ${densityColor(node.density)}`}>{node.density}%</span></div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${densityBarColor(node.density)} transition-all duration-700`} style={{ width: `${node.density}%` }} />
                </div>
            </div>

            {/* Signal + camera stats */}
            <div className="grid grid-cols-4 gap-3 text-xs">
                {[
                    ['Phase', 'N-S GREEN', 'text-accent-green'],
                    ['Cycle', `${Math.round(15 + node.density * 0.4)}s`, 'text-text-primary'],
                    ['Camera', 'Online', 'text-accent-green'],
                    ['Detections', `${(800 + Math.round(node.density * 15)).toLocaleString()}`, 'text-accent-cyan'],
                ].map(([l, v, c]) => (
                    <div key={l}><div className="text-text-muted text-[0.62rem] uppercase mb-1">{l}</div><div className={`font-bold ${c}`}>{v}</div></div>
                ))}
            </div>
        </div>
    );
}

/* ── Live Corridor Card ── */
function CorridorCard({ corridor, onTerminate }) {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(t);
    }, []);
    const mins = Math.floor(elapsed / 60);
    const secs = (elapsed % 60).toString().padStart(2, '0');

    const nodes = corridor.corridorNodes || [];
    const activeNodeIdx = corridor.activeNodeIdx || 0;

    return (
        <div className="bg-accent-cyan/[0.04] border border-accent-cyan/25 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent-cyan/10 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                    <span className="text-[0.62rem] font-bold uppercase tracking-widest text-accent-cyan">Live Corridor</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[0.62rem] font-mono text-text-muted">{mins}m {secs}s</span>
                    <button onClick={onTerminate} className="text-[0.58rem] font-bold text-accent-red border border-accent-red/30 rounded-lg px-2 py-0.5 bg-accent-red/10 hover:bg-accent-red/20 font-sans cursor-pointer">TERMINATE</button>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <Badge variant="red">{corridor.vehicleId || 'AMB-042'}</Badge>
                <Badge variant="green">ACTIVE</Badge>
                <span className="text-[0.65rem] text-text-muted capitalize ml-auto">{corridor.corridorType || 'ambulance'}</span>
            </div>

            <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-accent-cyan flex-shrink-0" />
                <span className="text-xs text-text-secondary truncate">{corridor.origin || 'Origin'}</span>
            </div>
            <div className="w-px h-3 bg-white/10 ml-[3px] my-0.5" />
            <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-accent-violet flex-shrink-0" />
                <span className="text-xs text-text-secondary truncate">{corridor.dest || 'Destination'}</span>
            </div>

            {/* Live intersection status box */}
            {nodes.length > 0 && (
                <div className="mb-3">
                    <CorridorStatusBox
                        nodes={nodes}
                        activeIdx={activeNodeIdx}
                        eta={corridor.duration || '—'}
                        stops={0}
                    />
                </div>
            )}

            {/* View real-time updates in Portal */}
            <Link href={`/portal?corridorId=${corridor.id}`} className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-text-primary no-underline hover:border-accent-cyan/30 hover:text-accent-cyan transition-all">
                🗺 View Real-Time Updates in Portal →
            </Link>
        </div>
    );
}

/* ── Demo Corridor Status — city-aware, auto-animates ── */
function DemoCorridorStatus({ etaStr, cityName }) {
    const cityNodes = CITY_NODES[cityName] || CITY_NODES['Delhi'];
    const demoNodes = cityNodes.slice(0, 5).map(n => ({ id: n.id, name: n.name }));
    const [activeIdx, setActiveIdx] = useState(0);
    // Reset animation when city changes
    useEffect(() => { setActiveIdx(0); }, [cityName]);
    useEffect(() => {
        const t = setInterval(() => {
            setActiveIdx(i => (i + 1) % demoNodes.length);
        }, 8000);
        return () => clearInterval(t);
    }, [cityName]);
    return (
        <CorridorStatusBox
            nodes={demoNodes}
            activeIdx={activeIdx}
            eta={etaStr}
            stops={0}
        />
    );
}

export default function DashboardPage() {
    const [nodes, setNodes] = useState(() => buildCityNodes('Delhi'));
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [etaSec, setEtaSec] = useState(222);
    const [speed, setSpeed] = useState(68);
    const [liveCorridors, setLiveCorridors] = useState([]);

    const CITIES = [
        { name: 'Delhi', state: 'Delhi NCR' },
        { name: 'Mumbai', state: 'Maharashtra' },
        { name: 'Bengaluru', state: 'Karnataka' },
        { name: 'Chennai', state: 'Tamil Nadu' },
        { name: 'Hyderabad', state: 'Telangana' },
        { name: 'Kolkata', state: 'West Bengal' },
        { name: 'Pune', state: 'Maharashtra' },
        { name: 'Ahmedabad', state: 'Gujarat' },
    ];

    /* Reset nodes when city changes */
    useEffect(() => {
        if (selectedCity) setNodes(buildCityNodes(selectedCity));
    }, [selectedCity]);

    /* Live density update */
    useEffect(() => {
        const t = setInterval(() => {
            setNodes(prev => prev.map(n => ({
                ...n,
                density: Math.max(5, Math.min(99, n.density + Math.floor(Math.random() * 7) - 3))
            })));
        }, 2200);
        return () => clearInterval(t);
    }, []);

    /* ETA countdown */
    useEffect(() => {
        const t = setInterval(() => {
            setEtaSec(s => Math.max(0, s - 1));
            setSpeed(Math.floor(60 + Math.random() * 20));
        }, 1000);
        return () => clearInterval(t);
    }, []);

    /* Keep selected node in sync with live density updates */
    useEffect(() => {
        if (!selectedNode) return;
        const updated = nodes.find(n => n.id === selectedNode.id);
        if (updated) setSelectedNode(updated);
    }, [nodes]);

    /* Poll localStorage for live corridors */
    useEffect(() => {
        const poll = () => {
            try {
                const raw = localStorage.getItem('aura_active_corridors');
                setLiveCorridors(raw ? JSON.parse(raw) : []);
            } catch { setLiveCorridors([]); }
        };
        poll();
        const t = setInterval(poll, 1500);
        window.addEventListener('storage', poll);
        return () => { clearInterval(t); window.removeEventListener('storage', poll); };
    }, []);

    function terminateCorridor(id) {
        try {
            const raw = localStorage.getItem('aura_active_corridors');
            const corridors = raw ? JSON.parse(raw) : [];
            const updated = corridors.filter(c => c.id !== id);
            localStorage.setItem('aura_active_corridors', JSON.stringify(updated));
            setLiveCorridors(updated);
        } catch { }
    }

    // Only show corridors for the currently selected city
    const cityLiveCorridors = selectedCity
        ? liveCorridors.filter(c => !c.city || c.city === selectedCity)
        : liveCorridors;

    const etaStr = `${Math.floor(etaSec / 60)}m ${(etaSec % 60).toString().padStart(2, '0')}s`;
    const avgDensity = Math.round(nodes.reduce((s, n) => s + n.density, 0) / nodes.length);
    const cityLanes = selectedCity ? getCityLanes(selectedCity) : getCityLanes('Delhi');

    /* ── City picker ── */
    if (!selectedCity) {
        return (
            <div className="bg-bg-deep text-text-primary font-sans min-h-screen flex flex-col">
                <div className="grid-bg" />
                <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-bg-deep/95 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2 font-extrabold text-xl no-underline text-white">
                        <div className="w-8 h-8 rounded-[6px] bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center neon-cyan">⬡</div>
                        <span><span className="text-accent-cyan">AURA</span>-GRID</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/portal" className="inline-flex gap-1.5 items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent-cyan text-black no-underline">🔒 Portal</Link>
                        <Link href="/" className="inline-flex gap-1.5 items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 text-text-primary no-underline">← Home</Link>
                    </div>
                </header>

                <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-20">
                    <div className="flex items-center gap-2 mb-4 text-accent-cyan text-xs font-bold uppercase tracking-widest">
                        <span className="w-5 h-0.5 bg-accent-cyan rounded-full" />Monitor City
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-center">Select a City</h1>
                    <p className="text-text-secondary text-sm mb-12 text-center max-w-md">View live traffic intelligence, active green corridors, and critical intersection stats.</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-3xl w-full">
                        {CITIES.map(city => (
                            <button key={city.name} onClick={() => setSelectedCity(city.name)}
                                className="flex flex-col items-start gap-1 bg-bg-card border border-white/5 hover:border-accent-cyan/40 hover:bg-accent-cyan/[0.04] rounded-2xl p-5 text-left transition-all cursor-pointer font-sans group">
                                <span className="text-base font-bold group-hover:text-accent-cyan transition-colors">{city.name}</span>
                                <span className="text-[0.7rem] text-text-muted">{city.state}</span>
                                {city.name === 'Delhi' && <span className="text-[0.6rem] font-bold text-accent-cyan mt-1.5">● LIVE DATA</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ── Main Dashboard ── */
    return (
        <div className="bg-bg-deep text-text-primary font-sans min-h-screen flex flex-col">
            <div className="grid-bg" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-3.5 bg-bg-deep/95 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 font-extrabold text-lg no-underline text-white">
                        <div className="w-7 h-7 rounded-[5px] bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center neon-cyan text-sm">⬡</div>
                        <span><span className="text-accent-cyan">AURA</span>-GRID</span>
                    </Link>
                    <div className="w-px h-5 bg-white/10" />
                    <span className="text-xs text-text-muted">Live Control</span>
                    <span className="text-xs font-bold text-accent-cyan">{selectedCity}</span>
                    <button onClick={() => setSelectedCity(null)} className="text-[0.6rem] text-text-muted hover:text-white bg-white/5 border border-white/5 rounded-md px-1.5 py-0.5 font-sans cursor-pointer">Change</button>
                </div>

                <div className="flex items-center gap-8">
                    {[
                        ['Active Corridors', String(liveCorridors.length || 0), 'text-accent-green'],
                        ['Nodes Online', '24/24', 'text-accent-cyan'],
                        ['Avg Density', `${avgDensity}%`, avgDensity > 70 ? 'text-accent-red' : avgDensity > 45 ? 'text-accent-amber' : 'text-accent-green'],
                    ].map(([l, v, c]) => (
                        <div key={l} className="flex flex-col items-center">
                            <span className="text-[0.58rem] text-text-muted uppercase tracking-widest">{l}</span>
                            <span className={`text-lg font-extrabold font-mono leading-tight ${c}`}>{v}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 bg-accent-green/10 border border-accent-green/20 rounded-full px-2.5 py-1">
                        <StatusDot color="green" /><span className="font-mono text-xs text-text-secondary">LIVE</span>
                    </div>
                    <Link href="/portal" className="inline-flex gap-1.5 items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent-cyan text-black no-underline">Portal</Link>
                    <Link href="/" className="inline-flex gap-1.5 items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 text-text-primary no-underline">Home</Link>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 flex-1 p-6 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 overflow-auto">

                {/* LEFT column */}
                <div className="flex flex-col gap-6">

                    {/* ─── Feature Navigator — evaluator quick-access ─── */}
                    <div className="bg-bg-card border border-white/5 rounded-2xl p-4">
                        <div className="text-[0.6rem] font-bold uppercase tracking-widest text-text-muted mb-3">Feature Navigator — Try All Flows</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <Link href="/routes" className="flex flex-col gap-1 bg-accent-cyan/[0.05] border border-accent-cyan/20 hover:border-accent-cyan/50 rounded-xl p-3 no-underline transition-all group">
                                <span className="text-xs font-bold text-accent-cyan group-hover:text-white transition-colors">Route Finder</span>
                                <span className="text-[0.6rem] text-text-muted leading-tight">Public commuter — no login</span>
                            </Link>
                            <Link href="/portal" className="flex flex-col gap-1 bg-accent-green/[0.05] border border-accent-green/20 hover:border-accent-green/50 rounded-xl p-3 no-underline transition-all group">
                                <span className="text-xs font-bold text-accent-green group-hover:text-white transition-colors">Green Corridor</span>
                                <span className="text-[0.6rem] text-text-muted leading-tight">Verified dispatcher — login required</span>
                            </Link>
                            <button onClick={() => document.getElementById('yolo-panel')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col gap-1 bg-accent-amber/[0.05] border border-accent-amber/20 hover:border-accent-amber/50 rounded-xl p-3 text-left transition-all group cursor-pointer font-sans">
                                <span className="text-xs font-bold text-accent-amber group-hover:text-white transition-colors">Visual Failsafe</span>
                                <span className="text-[0.6rem] text-text-muted leading-tight">YOLO detection — scroll down</span>
                            </button>
                            <Link href="/admin" className="flex flex-col gap-1 bg-accent-red/[0.05] border border-accent-red/20 hover:border-accent-red/50 rounded-xl p-3 no-underline transition-all group">
                                <span className="text-xs font-bold text-accent-red group-hover:text-white transition-colors">Admin Panel</span>
                                <span className="text-[0.6rem] text-text-muted leading-tight">Signal control, users, corridors</span>
                            </Link>
                        </div>
                    </div>

                    {/* Live Green Corridors */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">Live Green Corridors — {selectedCity}</h2>
                                {cityLiveCorridors.length > 0 && (
                                    <span className="text-[0.6rem] font-bold bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded-full px-2 py-0.5">{cityLiveCorridors.length} Active</span>
                                )}
                            </div>
                            <Link href="/portal" className="text-[0.7rem] font-semibold text-accent-cyan hover:text-white transition-colors no-underline">+ New Corridor →</Link>
                        </div>

                        {cityLiveCorridors.length === 0 ? (
                            <div className="border border-white/5 border-dashed rounded-2xl p-8 text-center">
                                <div className="text-3xl mb-3">🚑</div>
                                <div className="text-sm font-semibold text-text-muted mb-2">No active corridors in {selectedCity}</div>
                                <p className="text-xs text-text-muted mb-4">Corridors activated from the portal for this city appear here in real time.</p>
                                <Link href="/portal" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-cyan text-black no-underline hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                                    Activate Green Corridor
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                {cityLiveCorridors.map(c => (
                                    <CorridorCard key={c.id} corridor={c} onTerminate={() => terminateCorridor(c.id)} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ALL Intersection Nodes */}
                    <section className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">Intersection Nodes — {selectedCity}</h2>
                                <Badge variant="cyan">{nodes.length} Active</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-[0.65rem] text-text-muted">
                                {[['#00ff9d', 'Low'], ['#ffb800', 'Med'], ['#ff3b5c', 'High']].map(([c, l]) => (
                                    <span key={l} className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}</span>
                                ))}
                                <span className="text-[0.62rem] text-text-muted italic">Click node for details</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {nodes.map(node => <NodeRow key={node.id} node={node} onClick={setSelectedNode} />)}
                        </div>
                        {/* Slide-up detail panel */}
                        {selectedNode && (
                            <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)} />
                        )}
                    </section>

                    {/* ─── YOLO AI Traffic Density Panel (full-width) ─── */}
                    <YoloFailsafePanel cityName={selectedCity} />
                </div>

                {/* RIGHT sidebar */}
                <div className="flex flex-col gap-5">

                    {/* Active corridor (static/demo) */}
                    <div className="bg-bg-card border border-white/5 rounded-2xl p-5">
                        <div className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted mb-4">🚑 Demo Corridor — {selectedCity}</div>
                        <div className="bg-accent-cyan/[0.04] border border-accent-cyan/15 rounded-xl p-4">
                            <div className="flex flex-wrap gap-1.5 mb-3"><Badge variant="red">AMB-042</Badge><Badge variant="green">ACTIVE</Badge></div>
                            <div className="text-xs font-semibold mb-1">📍 {(CITY_NODES[selectedCity] || CITY_NODES['Delhi'])[0]?.name || 'Start'}</div>
                            <div className="w-0.5 h-3 bg-gradient-to-b from-accent-green to-accent-cyan ml-2 my-1.5" />
                            <div className="text-xs font-semibold mb-3">🏥 {(CITY_NODES[selectedCity] || CITY_NODES['Delhi'])[4]?.name || 'End'}</div>

                            {/* Demo CorridorStatusBox with city-specific nodes */}
                            <DemoCorridorStatus etaStr={etaStr} cityName={selectedCity} />

                            <div className="flex gap-5 pt-3 border-t border-white/5 mt-3">
                                {[['Speed', `${speed} km/h`, 'text-white'], ['Stops', '0', 'text-accent-green']].map(([l, v, c]) => (
                                    <div key={l}><div className="text-[0.58rem] text-text-muted uppercase">{l}</div><div className={`font-bold font-mono text-sm ${c}`}>{v}</div></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lane density */}
                    <div className="bg-bg-card border border-white/5 rounded-2xl p-5">
                        <div className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted mb-4">🚗 Lane Density — {selectedCity}</div>
                        <div className="flex flex-col gap-3">
                            {cityLanes.map((label, i) => {
                                const d = nodes[i * 4]?.density ?? 50;
                                const c = d < 40 ? 'progress-fill-green' : d < 70 ? 'progress-fill-amber' : 'progress-fill-red';
                                const tc = d < 40 ? 'text-accent-green' : d < 70 ? 'text-accent-amber' : 'text-accent-red';
                                return (
                                    <div key={label} className="flex items-center gap-2.5 text-xs text-text-secondary">
                                        <span className="w-[90px] flex-shrink-0 truncate">{label}</span>
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${c} transition-all duration-700`} style={{ width: `${d}%` }} />
                                        </div>
                                        <span className={`w-8 text-right font-bold font-mono text-xs ${tc}`}>{d}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* City stats */}
                    <div className="bg-bg-card border border-white/5 rounded-2xl p-5">
                        <div className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted mb-4">📊 City Stats</div>
                        <div className="grid grid-cols-2 gap-3">
                            {[['Avg Wait', '8.3s', 'text-text-primary'], ['CO₂ Saved', '2.4 t', 'text-accent-green'], ['Fuel Saved', '1,840L', 'text-accent-green'], ['Congestion', `${avgDensity}%`, avgDensity > 70 ? 'text-accent-red' : 'text-accent-amber']].map(([l, v, c]) => (
                                <div key={l} className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                    <div className="text-[0.6rem] text-text-muted mb-1">{l}</div>
                                    <div className={`text-base font-bold font-mono ${c}`}>{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-bg-card border border-white/5 rounded-2xl p-5">
                        <div className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted mb-4">⚡ Actions</div>
                        <Link href="/portal" className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold bg-accent-cyan text-black no-underline hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                            🚑 New Green Corridor
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
