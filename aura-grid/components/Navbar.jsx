'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-3.5 border-b border-white/5 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'bg-bg-deep/95 shadow-[0_4px_40px_rgba(0,245,255,0.08)]' : 'bg-bg-deep/80'
                }`}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight no-underline">
                <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center text-lg neon-cyan">
                    ⬡
                </div>
                <span>
                    <span className="text-accent-cyan">AURA</span>-GRID
                </span>
            </Link>

            {/* Nav links */}
            <ul className="hidden md:flex items-center gap-1 list-none">
                {[
                    { href: '/#hero', label: 'Home' },
                    { href: '/#problem', label: 'Problem' },
                    { href: '/#pillars', label: 'Solution' },
                    { href: '/#flows', label: 'User Flows' },
                    { href: '/#tech', label: 'Architecture' },
                    { href: '/#faq', label: 'Q&A' },
                ].map(({ href, label }) => (
                    <li key={href}>
                        <a
                            href={href}
                            className="px-3.5 py-2 text-sm font-medium text-text-secondary rounded-[6px] hover:text-text-primary hover:bg-white/5 transition-all duration-200 no-underline"
                        >
                            {label}
                        </a>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <div className="flex items-center gap-2.5">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-white/5 text-text-primary border border-white/5 hover:bg-white/10 transition-all no-underline"
                >
                    Live Dashboard
                </Link>
                <Link
                    href="/portal"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-accent-cyan text-black shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] hover:-translate-y-px transition-all no-underline"
                >
                    🔒 Green Corridor
                </Link>
            </div>
        </nav>
    );
}
