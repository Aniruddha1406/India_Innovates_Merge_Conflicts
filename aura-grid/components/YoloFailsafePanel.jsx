'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CITY_NODES } from '@/lib/cityNodes';

/* ─── Per-city camera sets (6 intersections each) ────────────────────────── */
const CITY_CAMERAS = {
    Delhi: [
        { id: 'CAM-01', name: 'Connaught Place', road: 'Janpath × Rajpath', ns: 'Janpath', ew: 'Rajpath' },
        { id: 'CAM-02', name: 'AIIMS Junction', road: 'Ring Rd × Aurobindo Marg', ns: 'Aurobindo', ew: 'Ring Rd' },
        { id: 'CAM-03', name: 'Karol Bagh', road: 'Pusa Rd × Arya Samaj Rd', ns: 'Arya Samaj', ew: 'Pusa Rd' },
        { id: 'CAM-04', name: 'IGI Terminal 3', road: 'NH-48 × Airport Rd', ns: 'Airport Rd', ew: 'NH-48' },
        { id: 'CAM-05', name: 'GTK Road Azadpur', road: 'GTK Rd × Outer Ring', ns: 'GTK Rd', ew: 'Outer Ring' },
        { id: 'CAM-06', name: 'Lajpat Nagar', road: 'Ring Rd × Andrews Ganj', ns: 'Andrews Ganj', ew: 'Ring Rd' },
    ],
    Mumbai: [
        { id: 'CAM-01', name: 'Dadar TT Circle', road: 'LBS Marg × Gokhale Rd', ns: 'Gokhale Rd', ew: 'LBS Marg' },
        { id: 'CAM-02', name: 'Mahim Causeway', road: 'SV Rd × Mahim Causeway', ns: 'Mahim C.', ew: 'SV Rd' },
        { id: 'CAM-03', name: 'Bandra-Kurla Complex', road: 'BKC Rd × Western Exp. Hwy', ns: 'Western Exp.', ew: 'BKC Rd' },
        { id: 'CAM-04', name: 'Andheri Junction', road: 'Andheri-Kurla × SV Rd', ns: 'SV Rd', ew: 'Andheri-Kurla' },
        { id: 'CAM-05', name: 'Ghatkopar Flyover', road: 'LBS Marg × Eastern Exp.', ns: 'Eastern Exp.', ew: 'LBS Marg' },
        { id: 'CAM-06', name: 'Borivali Junction', road: 'Western Exp. × NH-48', ns: 'NH-48', ew: 'Western Exp.' },
    ],
    Bengaluru: [
        { id: 'CAM-01', name: 'Silk Board Junction', road: 'Hosur Rd × Outer Ring Rd', ns: 'Hosur Rd', ew: 'Outer Ring' },
        { id: 'CAM-02', name: 'Hebbal Flyover', road: 'Bellary Rd × ORR', ns: 'Bellary Rd', ew: 'ORR' },
        { id: 'CAM-03', name: 'Marathahalli Bridge', road: 'Outer Ring Rd × HAL New Rd', ns: 'HAL New Rd', ew: 'Outer Ring' },
        { id: 'CAM-04', name: 'Majestic Bus Stand', road: 'Mysore Rd × JC Rd', ns: 'JC Rd', ew: 'Mysore Rd' },
        { id: 'CAM-05', name: 'Electronic City', road: 'Hosur Rd × EC Phase I Rd', ns: 'EC Phase I', ew: 'Hosur Rd' },
        { id: 'CAM-06', name: 'Whitefield Junction', road: 'Whitefield Rd × ITPL Rd', ns: 'ITPL Rd', ew: 'Whitefield Rd' },
    ],
    Hyderabad: [
        { id: 'CAM-01', name: 'Hitech City Junction', road: 'HITEC Rd × Outer Ring Rd', ns: 'Outer Ring', ew: 'HITEC Rd' },
        { id: 'CAM-02', name: 'Jubilee Hills Check Post', road: 'Road No.36 × Jubilee Hills Rd', ns: 'Jubilee Hills', ew: 'Rd No.36' },
        { id: 'CAM-03', name: 'Ameerpet Junction', road: 'SR Nagar × MG Rd', ns: 'MG Rd', ew: 'SR Nagar' },
        { id: 'CAM-04', name: 'Secunderabad Clock Tower', road: 'MG Rd × SP Rd', ns: 'MG Rd', ew: 'SP Rd' },
        { id: 'CAM-05', name: 'Gachibowli Circle', road: 'Gachibowli × ORR', ns: 'ORR', ew: 'Gachibowli Rd' },
        { id: 'CAM-06', name: 'Charminar Circle', road: 'MG Rd × Char Minar Rd', ns: 'Char Minar', ew: 'MG Rd' },
    ],
    Chennai: [
        { id: 'CAM-01', name: 'Anna Salai Junction', road: 'Anna Salai × Nandanam', ns: 'Nandanam', ew: 'Anna Salai' },
        { id: 'CAM-02', name: 'T. Nagar Pondy Bazar', road: 'Usman Rd × Pondy Bazar', ns: 'Pondy Bazar', ew: 'Usman Rd' },
        { id: 'CAM-03', name: 'Koyambedu Hub', road: 'Poonamallee Rd × GST', ns: 'GST Rd', ew: 'Poonamallee' },
        { id: 'CAM-04', name: 'Guindy Junction', road: 'Inner Ring × GST Rd', ns: 'GST Rd', ew: 'Inner Ring' },
        { id: 'CAM-05', name: 'Adyar Signal', road: 'LB Rd × Lattice Bridge', ns: 'LB Rd', ew: 'Lattice Bridge' },
        { id: 'CAM-06', name: 'Velachery Junction', road: 'Velachery Main × Taramani', ns: 'Taramani', ew: 'Velachery Main' },
    ],
    Pune: [
        { id: 'CAM-01', name: 'Shivajinagar Circle', road: 'FC Rd × Ganeshkhind Rd', ns: 'Ganeshkhind', ew: 'FC Rd' },
        { id: 'CAM-02', name: 'Swargate Bus Stand', road: 'Solapur Rd × Satara Rd', ns: 'Satara Rd', ew: 'Solapur Rd' },
        { id: 'CAM-03', name: 'Hadapsar Junction', road: 'Solapur Rd × Magarpatta', ns: 'Magarpatta', ew: 'Solapur Rd' },
        { id: 'CAM-04', name: 'Pimpri Circle', road: 'Pune-Mumbai Hwy × NH-48', ns: 'NH-48', ew: 'Pune-Mumbai Hwy' },
        { id: 'CAM-05', name: 'Baner Junction', road: 'Baner Rd × Pashan Rd', ns: 'Pashan Rd', ew: 'Baner Rd' },
        { id: 'CAM-06', name: 'Hinjewadi Phase 1', road: 'Hinjewadi Rd × SP Ring', ns: 'SP Ring', ew: 'Hinjewadi Rd' },
    ],
    Kolkata: [
        { id: 'CAM-01', name: 'Esplanade Crossing', road: 'Red Rd × JL Nehru Rd', ns: 'JL Nehru Rd', ew: 'Red Rd' },
        { id: 'CAM-02', name: 'Park Street Junction', road: 'Park St × Camac St', ns: 'Camac St', ew: 'Park St' },
        { id: 'CAM-03', name: 'Gariahat More', road: 'Rashbehari × Gariahat Rd', ns: 'Gariahat Rd', ew: 'Rashbehari' },
        { id: 'CAM-04', name: 'Dum Dum Junction', road: 'VIP Rd × Jesse Rd', ns: 'Jessore Rd', ew: 'VIP Rd' },
        { id: 'CAM-05', name: 'Howrah Station', road: 'GT Rd × Rabindra Sarani', ns: 'Rabindra Sarani', ew: 'GT Rd' },
        { id: 'CAM-06', name: 'New Town Sector V', road: 'Action Area × Webel More', ns: 'Webel More', ew: 'Action Area' },
    ],
    Ahmedabad: [
        { id: 'CAM-01', name: 'ISCON Circle', road: 'SG Hwy × Sarkhej-Gandhinagar', ns: 'SG Highway', ew: 'Sarkhej-GN' },
        { id: 'CAM-02', name: 'Navrangpura Circle', road: 'CG Rd × Navrangpura Rd', ns: 'CG Rd', ew: 'Navrangpura' },
        { id: 'CAM-03', name: 'Maninagar Circle', road: 'SP Ring × National Hwy', ns: 'National Hwy', ew: 'SP Ring' },
        { id: 'CAM-04', name: 'Shivranjani Cross Rd', road: 'Satellite Rd × 132 Ring', ns: '132 Ring', ew: 'Satellite Rd' },
        { id: 'CAM-05', name: 'Chandkheda Junction', road: 'NH-48 × Sabarmati Rd', ns: 'Sabarmati Rd', ew: 'NH-48' },
        { id: 'CAM-06', name: 'Naroda Junction', road: 'Naroda Rd × Ring Rd', ns: 'Ring Rd', ew: 'Naroda Rd' },
    ],
};

const CYCLE = { green: 20, yellow: 5, red: 15 };
const SIG_COLOR = { green: '#00ff9d', yellow: '#ffb800', red: '#ff3b5c' };
const SIG_GLOW = { green: '0 0 12px #00ff9d99', yellow: '0 0 12px #ffb80099', red: '0 0 12px #ff3b5c99' };

function densityToSignal(d) {
    if (d < 40) return 'green';
    if (d < 70) return 'yellow';
    return 'red';
}

/* ─── N/S/E/W directional signal indicator ──────────────────────────────── */
function DirectionSignals({ nsColor, ewColor }) {
    const dirs = [
        { label: 'N', color: nsColor, top: 0, left: '50%', transform: 'translateX(-50%)' },
        { label: 'S', color: nsColor, bottom: 0, left: '50%', transform: 'translateX(-50%)' },
        { label: 'E', color: ewColor, right: 0, top: '50%', transform: 'translateY(-50%)' },
        { label: 'W', color: ewColor, left: 0, top: '50%', transform: 'translateY(-50%)' },
    ];
    return (
        <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
            {/* Road lines */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.06)', transform: 'translateX(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.06)', transform: 'translateY(-50%)' }} />
            {/* Centre box */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 14, height: 14, background: '#080d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }} />
            {/* Direction dots */}
            {dirs.map(d => (
                <div key={d.label} style={{ position: 'absolute', top: d.top, bottom: d.bottom, left: d.left, right: d.right, transform: d.transform, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: SIG_COLOR[d.color], boxShadow: SIG_GLOW[d.color], transition: 'all 0.4s ease' }} />
                    <div style={{ fontSize: '0.42rem', fontWeight: 800, fontFamily: 'monospace', color: SIG_COLOR[d.color], letterSpacing: '0.04em' }}>{d.label}</div>
                </div>
            ))}
        </div>
    );
}

/* ─── 3-bulb signal pole ─────────────────────────────────────────────────── */
function SignalLamp({ active }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '5px 4px', background: '#050a14', borderRadius: 7, border: '1px solid rgba(255,255,255,0.06)' }}>
            {['red', 'yellow', 'green'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c === active ? SIG_COLOR[c] : 'rgba(255,255,255,0.05)', boxShadow: c === active ? SIG_GLOW[c] : 'none', transition: 'all 0.4s ease' }} />
            ))}
        </div>
    );
}

/* ─── Camera card ────────────────────────────────────────────────────────── */
function CameraCard({ cam, density, signal, timer, event, emergency }) {
    const displaySignal = emergency || signal;
    const isEmgGreen = emergency === 'green';
    const isEmgRed = emergency === 'red';
    const isEmgYellow = emergency === 'yellow';
    const barColor = density < 40 ? '#00ff9d' : density < 70 ? '#ffb800' : '#ff3b5c';
    const isAmbulance = event?.type === 'ambulance';
    const isDense = event?.type === 'dense';

    // N/S follows main signal direction, E/W gets opposite (simplified model)
    const nsSignal = isEmgGreen ? 'green' : isEmgRed ? 'red' : isEmgYellow ? 'yellow' : signal;
    const ewSignal = isEmgGreen ? 'red' : isEmgRed ? 'green' : isEmgYellow ? 'yellow'
        : signal === 'green' ? 'red' : signal === 'red' ? 'green' : 'yellow';

    return (
        <div style={{ background: isEmgGreen ? 'rgba(0,255,157,0.05)' : isEmgRed ? 'rgba(255,59,92,0.03)' : 'rgba(10,15,26,0.8)', border: `1px solid ${isEmgGreen ? 'rgba(0,255,157,0.4)' : density >= 70 ? 'rgba(255,59,92,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: '12px 13px', display: 'flex', flexDirection: 'column', gap: 9, transition: 'all 0.5s ease', position: 'relative', overflow: 'hidden' }}>

            {isEmgGreen && <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(0,255,157,0.07),transparent)', animation: 'shimmer 2s infinite', pointerEvents: 'none' }} />}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.52rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)', marginBottom: 2 }}>{cam.id} · LIVE</div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: isEmgGreen ? '#00ff9d' : isEmgRed ? '#ff3b5c' : 'rgba(255,255,255,0.85)', transition: 'color 0.5s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cam.name}</div>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>{cam.road}</div>
                </div>
                {/* Signal pole + countdown */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <SignalLamp active={displaySignal} />
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, fontFamily: 'monospace', color: SIG_COLOR[displaySignal] }}>{emergency ? '--' : `${String(timer).padStart(2, '0')}s`}</div>
                </div>
            </div>

            {/* Camera feed */}
            <div style={{ height: 58, background: '#050a14', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, height: 1.5, background: 'rgba(0,245,255,0.38)', animation: 'scanline 2.2s linear infinite', boxShadow: '0 0 5px #00f5ff' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,245,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.025) 1px,transparent 1px)', backgroundSize: '14px 14px' }} />
                <div style={{ zIndex: 1, fontSize: '0.52rem', fontFamily: 'monospace', color: isAmbulance ? '#ffb800' : isDense ? '#ff3b5c' : 'rgba(255,255,255,0.16)' }}>
                    {isAmbulance ? `Class: Ambulance  conf ${event.conf}%` : isDense ? `Dense traffic  ${density}%` : 'SCANNING'}
                </div>
                {event && <div style={{ position: 'absolute', top: 7, right: 7, width: isAmbulance ? 28 : 42, height: isAmbulance ? 18 : 12, border: `1px solid ${isAmbulance ? '#ffb800' : '#ff3b5c'}`, borderRadius: 2, boxShadow: `0 0 5px ${isAmbulance ? '#ffb80066' : '#ff3b5c66'}` }} />}
            </div>

            {/* Density bar */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: 'rgba(255,255,255,0.28)', marginBottom: 3 }}>
                    <span>Density</span>
                    <span style={{ color: barColor, fontWeight: 700, fontFamily: 'monospace' }}>{density}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${density}%`, background: barColor, borderRadius: 4, boxShadow: `0 0 5px ${barColor}55`, transition: 'width 0.9s ease, background 0.5s ease' }} />
                </div>
            </div>

            {/* N/S/E/W direction map + status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <DirectionSignals nsColor={nsSignal} ewColor={ewSignal} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', marginBottom: 3, lineHeight: 1.4 }}>
                        <span style={{ color: SIG_COLOR[nsSignal] }}>N/S</span> {cam.ns}
                        <br />
                        <span style={{ color: SIG_COLOR[ewSignal] }}>E/W</span> {cam.ew}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: SIG_COLOR[displaySignal], boxShadow: SIG_GLOW[displaySignal], flexShrink: 0 }} />
                        <span style={{ fontSize: '0.55rem', fontWeight: 700, fontFamily: 'monospace', color: SIG_COLOR[displaySignal], letterSpacing: '0.04em' }}>
                            {isEmgGreen ? 'EMERGENCY CLEAR' : isEmgRed ? 'CROSS STOPPED' : isDense ? 'EXTENDING GREEN' : `${displaySignal.toUpperCase()} · ${density >= 70 ? 'HIGH' : density >= 40 ? 'MED' : 'LOW'}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function YoloFailsafePanel({ cityName = 'Delhi' }) {
    const cameras = CITY_CAMERAS[cityName] || CITY_CAMERAS['Delhi'];

    const [cams, setCams] = useState(() => cameras.map((_, i) => ({
        density: [78, 62, 45, 31, 87, 55][i] ?? 50,
        phase: ['green', 'yellow', 'red', 'green', 'yellow', 'red'][i],
        timer: [20, 5, 15, 20, 5, 15][i],
        event: null,
        emergency: null,
    })));

    const [log, setLog] = useState([]);
    const [paused, setPaused] = useState(false);
    const [nextAmb, setNextAmb] = useState(25);

    const pausedRef = useRef(false);
    const overrideRef = useRef(false);
    const ambRef = useRef(null);

    pausedRef.current = paused;

    // Reset when city changes
    useEffect(() => {
        setCams(cameras.map((_, i) => ({
            density: [78, 62, 45, 31, 87, 55][i] ?? 50,
            phase: ['green', 'yellow', 'red', 'green', 'yellow', 'red'][i],
            timer: [20, 5, 15, 20, 5, 15][i],
            event: null,
            emergency: null,
        })));
        setLog([{ ts: '--:--:--', msg: `Camera network switched to ${cityName}` }]);
    }, [cityName]);

    function addLog(msg) {
        const ts = new Date().toLocaleTimeString('en-IN', { hour12: false });
        setLog(p => [...p.slice(-9), { ts, msg }]);
    }

    /* Signal cycle tick */
    useEffect(() => {
        const t = setInterval(() => {
            if (pausedRef.current) return;
            setCams(prev => prev.map(c => {
                if (c.emergency !== null) return c;
                let { phase, timer } = c;
                timer -= 1;
                if (timer <= 0) {
                    if (phase === 'green') { phase = 'yellow'; timer = CYCLE.yellow; }
                    else if (phase === 'yellow') { phase = 'red'; timer = CYCLE.red; }
                    else { phase = 'green'; timer = CYCLE.green; }
                }
                return { ...c, phase, timer };
            }));
        }, 1000);
        return () => clearInterval(t);
    }, []);

    /* Density fluctuation */
    useEffect(() => {
        const t = setInterval(() => {
            if (pausedRef.current || overrideRef.current) return;
            setCams(prev => prev.map(c => ({ ...c, density: Math.max(8, Math.min(97, c.density + Math.floor(Math.random() * 11) - 5)) })));
        }, 2000);
        return () => clearInterval(t);
    }, []);

    /* High-density auto-extend */
    useEffect(() => {
        const t = setInterval(() => {
            if (pausedRef.current || overrideRef.current) return;
            setCams(prev => prev.map((c, i) => {
                if (c.density >= 72 && c.phase === 'red' && c.emergency === null) {
                    addLog(`Dense traffic: ${cameras[i].id} (${c.density}%) — green phase extended`);
                    return { ...c, phase: 'green', timer: CYCLE.green, event: { type: 'dense' } };
                }
                if (c.event?.type === 'dense' && c.density < 65) return { ...c, event: null };
                return c;
            }));
        }, 5000);
        return () => clearInterval(t);
    }, [cameras]);

    /* Ambulance override */
    const scheduleAmb = useCallback(() => {
        const delay = 20 + Math.floor(Math.random() * 20);
        setNextAmb(delay);
        let s = delay;
        if (ambRef.current) clearInterval(ambRef.current);
        ambRef.current = setInterval(() => {
            if (!pausedRef.current) s--;
            setNextAmb(s);
            if (s <= 0) {
                clearInterval(ambRef.current);
                runOverride();
            }
        }, 1000);
    }, [cameras]);

    function runOverride() {
        if (overrideRef.current) { scheduleAmb(); return; }
        overrideRef.current = true;
        const idx = Math.floor(Math.random() * cameras.length);
        const conf = +(94 + Math.random() * 4.8).toFixed(1);

        setCams(prev => prev.map((c, i) => i === idx ? { ...c, event: { type: 'ambulance', conf } } : c));
        addLog(`YOLO: Ambulance detected at ${cameras[idx].id} — ${cameras[idx].name} — conf ${conf}%`);

        setTimeout(() => {
            setCams(prev => prev.map(c => ({ ...c, emergency: 'yellow' })));
            addLog('Protocol: 3-second yellow clearance — all intersections');
            setTimeout(() => {
                setCams(prev => prev.map((c, i) => ({ ...c, emergency: i === idx ? 'green' : 'red' })));
                addLog(`Override: ${cameras[idx].name} N/S — GREEN 20s · E/W cross-traffic — RED`);
                setTimeout(() => {
                    setCams(prev => prev.map(c => ({ ...c, emergency: null, phase: 'green', timer: CYCLE.green })));
                    overrideRef.current = false;
                    addLog('Clear: Vehicle exited — normal cycle resumed');
                    scheduleAmb();
                }, 20000);
            }, 3000);
        }, 1500);
    }

    useEffect(() => {
        addLog(`AI Camera Network online — YOLO-v8 monitoring ${cityName}`);
        scheduleAmb();
        return () => { if (ambRef.current) clearInterval(ambRef.current); };
    }, []);

    const avgDensity = Math.round(cams.reduce((s, c) => s + c.density, 0) / cams.length);
    const isOverride = cams.some(c => c.emergency !== null);
    const emgActive = cams.some(c => c.emergency === 'green');

    return (
        <div style={{ background: 'rgba(7,12,22,0.97)', border: `1px solid ${emgActive ? 'rgba(0,255,157,0.25)' : 'rgba(0,245,255,0.1)'}`, borderRadius: 20, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color 0.5s' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: paused ? '#ffb800' : isOverride ? '#ff3b5c' : '#00ff9d', boxShadow: `0 0 10px ${paused ? '#ffb800' : isOverride ? '#ff3b5c' : '#00ff9d'}`, animation: 'pulse-dot 1.2s infinite', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 2 }}>AI Camera Network · YOLO-v8 · {cityName}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: emgActive ? '#00ff9d' : paused ? '#ffb800' : 'rgba(255,255,255,0.9)' }}>
                            {paused ? 'System Paused' : emgActive ? 'Emergency Override — Green corridor active' : `Monitoring ${cameras.length} intersections — Signal cycle running`}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                    {[['Cycle G/Y/R', `${CYCLE.green}/${CYCLE.yellow}/${CYCLE.red}s`, '#00f5ff'], ['High Density', cams.filter(c => c.density >= 70).length, '#ff3b5c'], ['Avg Density', `${avgDensity}%`, avgDensity > 70 ? '#ff3b5c' : avgDensity > 45 ? '#ffb800' : '#00ff9d'], ['Next Event', `${nextAmb}s`, '#a78bfa']].map(([l, v, c]) => (
                        <div key={l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 9, padding: '5px 10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.47rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 1 }}>{l}</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'monospace', color: c }}>{v}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Override banner */}
            {emgActive && (
                <div style={{ background: 'rgba(0,255,157,0.06)', border: '1px solid rgba(0,255,157,0.25)', borderRadius: 11, padding: '9px 14px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00ff9d', letterSpacing: '0.05em' }}>Emergency Override Active — N/S green corridor cleared, E/W cross-traffic stopped</div>
                    <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>YOLO-v8 visual detection · Edge-AI · No GPS required · 97%+ confidence</div>
                </div>
            )}

            {/* Camera grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 11 }}>
                {cams.map((c, i) => (
                    <CameraCard key={cameras[i].id} cam={cameras[i]} density={c.density} signal={c.phase} timer={c.timer} event={c.event} emergency={c.emergency} />
                ))}
            </div>

            {/* Cycle legend */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cycle:</span>
                {[['green', 'GREEN', `${CYCLE.green}s`], ['yellow', 'YELLOW', `${CYCLE.yellow}s`], ['red', 'RED', `${CYCLE.red}s`]].map(([c, l, t]) => (
                    <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.58rem', color: 'rgba(255,255,255,0.32)' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: SIG_COLOR[c], boxShadow: SIG_GLOW[c] }} />
                        <span>{l} — <strong style={{ color: SIG_COLOR[c], fontFamily: 'monospace' }}>{t}</strong></span>
                    </div>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: '0.52rem', color: 'rgba(255,255,255,0.14)', fontFamily: 'monospace' }}>Emergency interrupts cycle mid-phase</span>
            </div>

            {/* Event log */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '9px 12px', maxHeight: 88, overflowY: 'auto' }}>
                <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.18)', marginBottom: 3, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>System Log</div>
                {log.map((e, i) => (
                    <div key={i} style={{ fontSize: '0.57rem', fontFamily: 'monospace', display: 'flex', gap: 8, color: 'rgba(255,255,255,0.42)', padding: '1.5px 0' }}>
                        <span style={{ color: 'rgba(0,245,255,0.38)', flexShrink: 0 }}>{e.ts}</span>
                        <span>{e.msg}</span>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 9 }}>
                <button onClick={() => { setPaused(p => { addLog(!p ? 'System paused by operator' : 'System resumed'); return !p; }); }}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 11, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', border: `1px solid ${paused ? 'rgba(255,184,0,0.4)' : 'rgba(255,255,255,0.1)'}`, background: paused ? 'rgba(255,184,0,0.1)' : 'rgba(255,255,255,0.04)', color: paused ? '#ffb800' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s' }}>
                    {paused ? 'Resume' : 'Pause'}
                </button>
                <button onClick={() => { if (overrideRef.current) return; if (ambRef.current) clearInterval(ambRef.current); runOverride(); }} disabled={overrideRef.current || paused}
                    style={{ flex: 2.5, padding: '10px 0', borderRadius: 11, fontWeight: 800, fontSize: '0.78rem', cursor: overrideRef.current || paused ? 'not-allowed' : 'pointer', fontFamily: 'inherit', border: 'none', background: overrideRef.current || paused ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#ff3b5c,#cc1133)', color: overrideRef.current || paused ? 'rgba(255,255,255,0.2)' : '#fff', boxShadow: overrideRef.current || paused ? 'none' : '0 0 18px rgba(255,59,92,0.35)', transition: 'all 0.3s' }}>
                    Force Emergency Detection
                </button>
            </div>

            <style>{`
                @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
                @keyframes scanline  { 0%{top:0} 100%{top:100%} }
                @keyframes shimmer   { 0%{left:-100%} 100%{left:200%} }
            `}</style>
        </div>
    );
}
