'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '', vehicleNumber: '', type: 'ambulance' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    async function handleRegister(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
            await setDoc(doc(db, 'users', cred.user.uid), {
                name: form.name,
                email: form.email,
                vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
                vehicleType: form.type,
                role: 'user',
                verified: false,
                createdAt: serverTimestamp(),
            });
            router.push('/portal');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') setError('Email already registered. Sign in instead.');
            else if (err.code === 'auth/weak-password') setError('Password must be at least 6 characters.');
            else {
                console.error("Firebase Registration Error:", err);
                setError(`Registration failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-bg-deep font-sans flex items-center justify-center relative overflow-hidden">
            <div className="grid-bg" />
            <div className="glow-blob" style={{ width: 500, height: 500, top: -200, left: -100, opacity: 0.5, background: 'rgba(124,58,237,0.12)' }} />

            <div className="relative z-10 w-full max-w-md mx-4 bg-[rgba(13,17,23,0.92)] backdrop-blur-xl border border-[rgba(124,58,237,0.25)] rounded-[32px] p-10 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                <div className="flex flex-col items-center mb-7">
                    <Link href="/" className="flex items-center gap-2.5 font-extrabold text-2xl mb-3 no-underline text-white">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center text-2xl neon-cyan">⬡</div>
                        <span><span className="text-accent-cyan">Signal</span>Sync</span>
                    </Link>
                    <h2 className="text-xl font-bold mt-1">Create Account</h2>
                    <p className="text-text-secondary text-sm mt-1 text-center">Register to create green corridors for emergency vehicles</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">Full Name</label>
                        <input required className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Dr. Arjun Mehta" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">Email</label>
                        <input type="email" required className="input-field" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">Password</label>
                        <input type="password" required minLength={6} className="input-field" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" />
                    </div>

                    {/* Vehicle section */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                        <div className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wide mb-1">Vehicle Details</div>
                        <div className="flex gap-2">
                            {[['ambulance', 'Ambulance'], ['fire', 'Fire Truck'], ['vvip', 'VVIP Convoy']].map(([v, l]) => (
                                <button key={v} type="button" onClick={() => set('type', v)}
                                    className={`flex-1 py-2 px-1 rounded-xl border text-xs transition-all font-sans cursor-pointer ${form.type === v ? 'bg-accent-cyan/10 border-accent-cyan/35 text-accent-cyan' : 'bg-white/[0.02] border-white/5 text-text-secondary'}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[0.78rem] font-semibold text-text-secondary uppercase tracking-wide">Vehicle / Convoy Number</label>
                            <input required className="input-field font-mono" value={form.vehicleNumber} onChange={e => set('vehicleNumber', e.target.value)} placeholder="e.g. DL-1AB-2345 or AMB-042" />
                        </div>
                    </div>

                    {error && <p className="text-accent-red text-sm text-center">{error}</p>}

                    <button type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-br from-accent-violet to-[#7c3aed] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] disabled:opacity-50 transition-all font-sans cursor-pointer">
                        {loading ? 'Creating account…' : 'Register & Access Portal'}
                    </button>
                </form>

                <div className="mt-5 pt-4 border-t border-white/5 text-center text-sm text-text-muted">
                    Already registered?{' '}
                    <Link href="/auth/login" className="text-accent-cyan hover:underline">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
