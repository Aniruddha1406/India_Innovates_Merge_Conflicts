import './globals.css';

export const metadata = {
    title: 'AURA-GRID | AI-Powered Intelligent Traffic Management',
    description:
        'AURA-GRID uses AI vision, dynamic signal optimization, and verified green corridors to save lives, secure convoys, and reduce urban congestion.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-bg-deep text-text-primary font-sans overflow-x-hidden min-h-screen">
                <div className="grid-bg" />
                {children}
            </body>
        </html>
    );
}
