'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Badge from '@/components/Badge';
import StatusDot from '@/components/StatusDot';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { MAPS_LIBRARIES } from '@/components/DelhiMap';

// Leaflet-free dynamic import — now using Google Maps
const DelhiMap = dynamic(() => import('@/components/DelhiMap'), {
    ssr: false,
    loading: () => (
        <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050c18', borderRadius: '12px', color: '#00f5ff', fontSize: '0.9rem' }}>
            Loading map…
        </div>
    )
});

/* ── OTP Input ── */
function OtpInput() {
    const refs = Array.from({ length: 6 }, () => useRef(null));
    const defaults = ['4', '2', '7', '8', '1', '9'];
    return (
        <div className="flex gap-2 justify-center">
            {defaults.map((d, i) => (
                <input key={i} ref={refs[i]} type="text" maxLength={1} defaultValue={d}
                    onInput={e => { if (e.target.value && i < 5) refs[i + 1].current?.focus(); }}
                    onKeyDown={e => { if (e.key === 'Backspace' && !e.target.value && i > 0) refs[i - 1].current?.focus(); }}
                    className="w-11 h-12 text-center bg-white/5 border border-white/10 rounded-lg text-xl font-bold font-mono text-text-primary outline-none focus:border-[#a78bfa] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] transition-all"
                />
            ))}
        </div>
    );
}

/* ── Supported Cities ── */
const CITIES = [
    { name: 'Delhi', bounds: { north: 28.883, south: 28.404, east: 77.347, west: 76.839 } },
    { name: 'Mumbai', bounds: { north: 19.269, south: 18.893, east: 73.047, west: 72.776 } },
    { name: 'Bengaluru', bounds: { north: 13.144, south: 12.832, east: 77.752, west: 77.458 } },
    { name: 'Hyderabad', bounds: { north: 17.540, south: 17.248, east: 78.631, west: 78.327 } },
    { name: 'Chennai', bounds: { north: 13.234, south: 12.953, east: 80.334, west: 80.207 } },
    { name: 'Pune', bounds: { north: 18.633, south: 18.418, east: 73.957, west: 73.768 } },
    { name: 'Kolkata', bounds: { north: 22.639, south: 22.395, east: 88.430, west: 88.246 } },
    { name: 'Ahmedabad', bounds: { north: 23.121, south: 22.922, east: 72.705, west: 72.490 } },
];

/* ── Autocomplete Input ── */
function PlaceInput({ label, placeholder, onPlaceSelect, cityBounds }) {
    const acRef = useRef(null);
    const acOptions = cityBounds
        ? { bounds: cityBounds, strictBounds: true, componentRestrictions: { country: 'in' } }
        : { componentRestrictions: { country: 'in' } };
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">{label}</label>
            <Autocomplete
                onLoad={ac => { acRef.current = ac; }}
                onPlaceChanged={() => {
                    if (!acRef.current) return;
                    const place = acRef.current.getPlace();
                    if (place?.geometry?.location) {
                        onPlaceSelect({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                            name: place.formatted_address || place.name || '',
                        });
                    }
                }}
                options={acOptions}
            >
                <input
                    className="input-field w-full"
                    placeholder={placeholder}
                    style={{ width: '100%' }}
                />
            </Autocomplete>
        </div>
    );
}

/* ── Main Portal ── */
export default function PortalPage() {
    // Load Google Maps API (shares the cached script with DelhiMap.jsx)
    const { isLoaded: mapsLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: MAPS_LIBRARIES,
    });

    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState('ambulance');
    const [userId, setUserId] = useState('DISP-AMB-0042');
    const [corridorType, setCorridorType] = useState('ambulance');
    const [routeShown, setRouteShown] = useState(false);
    const [corridorActive, setCorridorActive] = useState(false);
    const [showCorridor, setShowCorridor] = useState(false);
    const [auditLog, setAuditLog] = useState([]);
    const [calculating, setCalculating] = useState(false);
    const [initiating, setInitiating] = useState(false);
    const [vehicleId, setVehicleId] = useState('AMB-042');
    const [city, setCity] = useState('Delhi');

    // Free-text location state
    const [originLatLng, setOriginLatLng] = useState(null);
    const [destLatLng, setDestLatLng] = useState(null);
    const [originName, setOriginName] = useState('');
    const [destName, setDestName] = useState('');

    // Route info returned by Google
    const [routeInfo, setRouteInfo] = useState(null); // {distanceText, durationText, durationSec}
    const [etaSec, setEtaSec] = useState(0);

    const addAudit = (type, msg) =>
        setAuditLog(prev => [{ type, msg, time: new Date().toLocaleTimeString() }, ...prev]);

    // ETA countdown while corridor is active
    useEffect(() => {
        if (!corridorActive || etaSec <= 0) return;
        const t = setInterval(() => setEtaSec(s => Math.max(0, s - 1)), 1000);
        return () => clearInterval(t);
    }, [corridorActive]);

    const handleRouteResult = useCallback((info) => {
        setRouteInfo(info);
        setEtaSec(info.durationSec || 0);
    }, []);

    function handleLogin(e) {
        e.preventDefault();
        setTimeout(() => {
            setLoggedIn(true);
            addAudit('AUTH', `User ${userId} authenticated via MFA`);
            addAudit('SESSION', `Portal accessed at ${new Date().toLocaleTimeString()}`);
        }, 1800);
    }

    function calcRoute() {
        if (!originLatLng || !destLatLng) return;
        setCalculating(true);
        addAudit('ROUTE', `Route initiated: ${originName} → ${destName}`);
        setTimeout(() => {
            setCalculating(false);
            setRouteShown(true);
            setShowCorridor(true);
            setCorridorActive(false);
            addAudit('ROUTE', 'Google Maps traffic-aware path computed');
        }, 800);
    }

    function swapPlaces() {
        setOriginLatLng(destLatLng);
        setDestLatLng(originLatLng);
        setOriginName(destName);
        setDestName(originName);
        setRouteShown(false);
        setShowCorridor(false);
        setCorridorActive(false);
        setRouteInfo(null);
    }

    function initiateWave() {
        setInitiating(true);
        addAudit('CORRIDOR', `GREEN WAVE INITIATED — ${originName} → ${destName}`);
        setTimeout(() => {
            setInitiating(false);
            setCorridorActive(true);
            addAudit('CORRIDOR', `Corridor active — vehicle en route`);
        }, 2000);
    }

    function deactivate() {
        setCorridorActive(false);
        addAudit('CORRIDOR', 'Corridor manually terminated by dispatcher');
    }

    const roleLabels = { ambulance: 'Hospital Dispatcher', police: 'Police Chief', vvip: 'VVIP Security Director' };
    const etaStr = etaSec > 0 ? `${Math.floor(etaSec / 60)}m ${(etaSec % 60).toString().padStart(2, '0')}s` : routeInfo?.durationText || '—';
    const canCalc = !!originLatLng && !!destLatLng;

    /* ── LOGIN SCREEN ── */
    if (!loggedIn) return (
        <div className="min-h-screen bg-bg-deep font-sans flex items-center justify-center relative overflow-hidden">
            <div className="grid-bg" />
            <div className="glow-blob" style={{ width: '500px', height: '500px', top: '-200px', left: '-100px', opacity: 0.5, background: 'rgba(0,245,255,0.12)' }} />
            <div className="glow-blob" style={{ width: '400px', height: '400px', bottom: '-100px', right: '-100px', opacity: 0.4, background: 'rgba(124,58,237,0.12)' }} />

            <div className="relative z-10 w-full max-w-md mx-4 bg-[rgba(13,17,23,0.9)] backdrop-blur-xl border border-[rgba(124,58,237,0.25)] rounded-[32px] p-10 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2.5 font-extrabold text-2xl mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center text-2xl neon-cyan">⬡</div>
                        <span><span className="text-accent-cyan">AURA</span>-GRID</span>
                    </div>
                    <Badge variant="violet">Secure Access Portal</Badge>
                    <h2 className="text-xl font-bold mt-3">Green Corridor Dispatcher</h2>
                    <p className="text-text-secondary text-sm mt-1 text-center">Authorized personnel only. All sessions are monitored.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">Dispatcher ID</label>
                        <input className="input-field" value={userId} onChange={e => setUserId(e.target.value)} placeholder="e.g. DISP-AMB-0042" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">Access Role</label>
                        <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="ambulance">Hospital Dispatcher (Ambulance)</option>
                            <option value="police">Police Chief (Emergency)</option>
                            <option value="vvip">VVIP Security Director</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">Access Code</label>
                        <input type="password" className="input-field" defaultValue="secret123" placeholder="••••••••" />
                    </div>
                    <div className="bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.2)] rounded-xl p-3.5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-semibold">Multi-Factor Verification</span>
                            <Badge variant="violet" className="ml-auto">OTP Sent</Badge>
                        </div>
                        <OtpInput />
                    </div>
                    <button type="submit" className="w-full py-3.5 rounded-xl font-bold bg-accent-cyan text-black shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all font-sans cursor-pointer">
                        Authenticate &amp; Access Portal
                    </button>
                </form>

                <div className="mt-5 pt-4 border-t border-white/5 text-center text-[0.7rem] text-text-muted">
                    Secured with AES-256 · JWT · RBAC + MFA
                </div>
            </div>
        </div>
    );

    /* ── PORTAL MAIN ── */
    return (
        <div className="min-h-screen bg-bg-deep font-sans relative">
            <div className="grid-bg" />
            <nav className="relative z-10 flex items-center justify-between px-10 py-3.5 bg-bg-deep/95 border-b border-white/5 backdrop-blur-xl">
                <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl no-underline text-white">
                    <div className="w-8 h-8 rounded-[6px] bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center neon-cyan">⬡</div>
                    <span><span className="text-accent-cyan">AURA</span>-GRID</span>
                </Link>
                <div className="flex items-center gap-2.5">
                    <Badge variant="violet">{roleLabels[role]}</Badge>
                    <Badge variant="green"><StatusDot color="green" className="mr-1" />Session Active</Badge>
                    <span className="text-[0.78rem] text-text-muted font-mono">{userId}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 text-text-primary no-underline">Dashboard</Link>
                    <Link href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 text-text-primary no-underline">← Home</Link>
                    <button onClick={() => setLoggedIn(false)} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[rgba(255,59,92,0.15)] text-accent-red border border-accent-red/30 font-sans cursor-pointer">Logout</button>
                </div>
            </nav>

            <div className="relative z-10 max-w-[1400px] mx-auto px-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-6">

                    {/* LEFT – Route Planner */}
                    <div className="flex flex-col gap-5">
                        <div className="bg-bg-card border border-white/5 rounded-xl p-6">
                            <Badge variant="red">
                                {corridorType === 'ambulance' ? 'Emergency Green Corridor' : corridorType === 'fire' ? 'Fire Truck Corridor' : 'VVIP Secure Corridor'}
                            </Badge>
                            <h3 className="text-lg font-bold mt-2.5 mb-1">Initiate Route</h3>
                            <p className="text-text-secondary text-sm mb-4">Select a city, then type the start and end location. Google Maps will find the best traffic-aware path.</p>

                            {/* City selector */}
                            <div className="flex flex-col gap-1.5 mb-4">
                                <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">City</label>
                                <select className="input-field" value={city}
                                    onChange={e => { setCity(e.target.value); setOriginLatLng(null); setDestLatLng(null); setOriginName(''); setDestName(''); setRouteShown(false); setShowCorridor(false); setCorridorActive(false); setRouteInfo(null); }}
                                    style={{ color: '#0f172a', background: '#f8fafc' }}>
                                    {CITIES.map(c => <option key={c.name} value={c.name} style={{ color: '#0f172a' }}>{c.name}</option>)}
                                </select>
                            </div>

                            {/* Corridor type */}
                            <div className="flex gap-2 mb-5">
                                {[['ambulance', 'Ambulance'], ['fire', 'Fire Truck'], ['vvip', 'VVIP']].map(([v, l]) => (
                                    <button key={v} onClick={() => setCorridorType(v)}
                                        className={`flex-1 py-3 px-2 rounded-xl border text-sm transition-all font-sans cursor-pointer ${corridorType === v ? 'bg-accent-cyan/10 border-accent-cyan/35 text-accent-cyan' : 'bg-white/[0.03] border-white/5 text-text-secondary hover:border-accent-cyan/25'}`}>
                                        {l}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3.5">
                                {/* Origin input with Google Places Autocomplete */}
                                {mapsLoaded ? (
                                    <PlaceInput
                                        key={`origin-${city}`}
                                        label="Origin"
                                        placeholder={`Start point in ${city}...`}
                                        cityBounds={CITIES.find(c => c.name === city)?.bounds}
                                        onPlaceSelect={p => { setOriginLatLng({ lat: p.lat, lng: p.lng }); setOriginName(p.name); setRouteShown(false); setShowCorridor(false); setCorridorActive(false); setRouteInfo(null); }}
                                    />
                                ) : (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">Origin</label>
                                        <input disabled className="input-field opacity-50" placeholder="Loading Google Maps..." />
                                    </div>
                                )}

                                {/* Swap */}
                                <div className="flex items-center gap-2.5">
                                    <div className="flex-1 h-px bg-white/10" />
                                    <button onClick={swapPlaces} disabled={!originLatLng && !destLatLng} title="Swap origin and destination"
                                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:border-accent-cyan/30 text-base font-sans cursor-pointer disabled:opacity-40">
                                        ⇅
                                    </button>
                                    <div className="flex-1 h-px bg-white/10" />
                                </div>

                                {/* Destination input with Google Places Autocomplete */}
                                {mapsLoaded ? (
                                    <PlaceInput
                                        key={`dest-${city}`}
                                        label="Destination"
                                        placeholder={`End point in ${city}...`}
                                        cityBounds={CITIES.find(c => c.name === city)?.bounds}
                                        onPlaceSelect={p => { setDestLatLng({ lat: p.lat, lng: p.lng }); setDestName(p.name); setRouteShown(false); setShowCorridor(false); setCorridorActive(false); setRouteInfo(null); }}
                                    />
                                ) : (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">Destination</label>
                                        <input disabled className="input-field opacity-50" placeholder="Loading Google Maps..." />
                                    </div>
                                )}



                                {!canCalc && (
                                    <p className="text-[0.75rem] text-text-muted text-center">
                                        Select origin and destination from the autocomplete suggestions to enable routing.
                                    </p>
                                )}

                                <button onClick={calcRoute} disabled={calculating || !canCalc}
                                    className="w-full py-3 rounded-xl font-bold bg-gradient-to-br from-accent-cyan to-[#0099cc] text-black disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all font-sans cursor-pointer">
                                    {calculating ? 'Routing...' : 'Get Best Route'}
                                </button>
                            </div>

                            {/* Route results */}
                            {routeShown && (
                                <div className="mt-5 pt-5 border-t border-white/10 flex flex-col gap-4">
                                    <div className="text-[0.7rem] text-text-muted uppercase tracking-widest mb-1">Google Maps Route</div>

                                    {/* Distance/time comparison */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl p-3.5">
                                            <div className="text-[0.68rem] text-text-muted uppercase mb-1">Without Corridor</div>
                                            <div className="text-2xl font-extrabold font-mono text-accent-amber">
                                                {routeInfo ? routeInfo.durationText : '—'}
                                            </div>
                                            <div className="text-xs text-text-secondary mt-1">{routeInfo?.distanceText || '—'} · with stops</div>
                                        </div>
                                        <div className="text-xs font-extrabold text-text-muted bg-white/5 border border-white/10 rounded-full px-2.5 py-1.5">VS</div>
                                        <div className="flex-1 bg-accent-green/5 border border-accent-green/30 rounded-xl p-3.5">
                                            <div className="text-[0.68rem] text-text-muted uppercase mb-1">AURA-GRID Corridor</div>
                                            <div className="text-2xl font-extrabold font-mono text-accent-green">
                                                {routeInfo ? `~${Math.round((routeInfo.durationSec * 0.6) / 60)}m` : '—'}
                                            </div>
                                            <div className="text-xs text-text-secondary mt-1">{routeInfo?.distanceText || '—'} · zero stops</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5 bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                                        <div className="text-[0.68rem] text-text-muted uppercase mb-1">Route</div>
                                        <div className="flex items-start gap-2">
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00f5ff', display: 'inline-block', flexShrink: 0, marginTop: 3 }} />
                                            <span className="text-sm text-text-secondary">{originName || '—'}</span>
                                        </div>
                                        <div className="ml-[5px] w-0.5 h-4 bg-white/10" />
                                        <div className="flex items-start gap-2">
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#a78bfa', display: 'inline-block', flexShrink: 0, marginTop: 3 }} />
                                            <span className="text-sm text-text-secondary">{destName || '—'}</span>
                                        </div>
                                    </div>

                                    {!corridorActive && (
                                        <button onClick={initiateWave} disabled={initiating}
                                            className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-br from-accent-green to-[#00cc7a] text-black shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.6)] disabled:opacity-60 transition-all font-sans cursor-pointer">
                                            {initiating ? 'Activating...' : 'Initiate Green Wave'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT – Map + Status */}
                    <div className="flex flex-col gap-5">
                        <div className="bg-bg-card border border-white/5 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h3 className="text-base font-bold">Delhi Traffic Map</h3>
                                    <p className="text-text-secondary text-xs">
                                        {routeShown && originName && destName
                                            ? `${originName} → ${destName}`
                                            : 'Type an origin and destination above to calculate route'}
                                    </p>
                                </div>
                                <Badge variant="cyan"><StatusDot color="cyan" className="mr-1" />Live</Badge>
                            </div>
                            <DelhiMap
                                showCorridor={showCorridor}
                                corridorActive={corridorActive}
                                originLatLng={originLatLng}
                                destLatLng={destLatLng}
                                originName={originName}
                                destName={destName}
                                onRouteResult={handleRouteResult}
                                onNodeUpdate={() => { }}
                            />
                        </div>

                        {/* Corridor status */}
                        {corridorActive && (
                            <div className="bg-bg-card border border-white/5 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <Badge variant="red">GREEN WAVE ACTIVE</Badge>
                                        <h3 className="mt-2 text-base font-bold">{vehicleId} — {originName} → {destName}</h3>
                                    </div>
                                    <button onClick={deactivate} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(255,59,92,0.15)] text-accent-red border border-accent-red/30 font-sans cursor-pointer">Terminate</button>
                                </div>

                                {/* Simple origin → destination timeline */}
                                <div className="flex flex-col gap-0">
                                    {[
                                        { label: originName || 'Origin', type: 'done', status: 'Departed' },
                                        { label: 'En Route (Corridor Active)', type: 'active', status: 'In Transit — all signals preempted' },
                                        { label: destName || 'Destination', type: 'pending', status: 'Awaiting arrival' },
                                    ].map(({ label, type, status }, i, a) => (
                                        <div key={i} className="flex items-start gap-3 relative pb-2">
                                            {i < a.length - 1 && <div className={`absolute left-[7px] top-4 w-0.5 h-full ${type === 'done' ? 'bg-accent-green/30' : 'bg-accent-cyan/30'}`} />}
                                            <div className={`w-4 h-4 rounded-full flex-shrink-0 border-2 mt-0.5 ${type === 'done' ? 'bg-accent-green border-accent-green/50' : type === 'active' ? 'bg-accent-cyan border-accent-cyan shadow-neon-cyan animate-pulse-dot' : 'bg-[#334155] border-[#475569]'}`} />
                                            <div>
                                                <div className="text-sm font-semibold">{label}</div>
                                                <div className={`text-xs mt-0.5 ${type === 'done' ? 'text-accent-green' : type === 'active' ? 'text-accent-cyan' : 'text-text-muted'}`}>{status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                                    {[['ETA', etaStr, 'text-accent-green'], ['Stops', '0', 'text-accent-green'], ['Distance', routeInfo?.distanceText || '—', 'text-accent-cyan']].map(([l, v, c]) => (
                                        <div key={l}>
                                            <div className="text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">{l}</div>
                                            <div className={`font-bold font-mono text-lg ${c}`}>{v}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
