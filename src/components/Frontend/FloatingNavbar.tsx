import { useState, useEffect } from 'react';
import { scrollToId } from '../../lib/scroll';

interface NavItem {
    label: string;
    targetId: string;
}

const navItems: NavItem[] = [
    { label: 'Inicio', targetId: 'hero-section' },
    { label: 'Testimonios', targetId: 'reviews-section' },
    { label: 'Experiencia', targetId: 'experience-section' },
    { label: 'Proyectos', targetId: 'features' },
    { label: 'Habilidades', targetId: 'skills-section' },
    { label: 'Contacto', targetId: 'contact-section' },
];

export default function FloatingNavbar() {
    const [activeSection, setActiveSection] = useState('hero-section');

    useEffect(() => {
        const observers = navItems.map((item) => {
            const el = document.getElementById(item.targetId);
            return { id: item.targetId, el };
        });

        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -50% 0px', // Trigger when section is in the middle of viewport
            threshold: 0,
        };

        const callback = (entries: IntersectionObserverEntry[]) => {
            const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
            if (isBottom) return;

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(callback, observerOptions);

        observers.forEach((obs) => {
            if (obs.el) observer.observe(obs.el);
        });

        // Throttle con rAF: como mucho una lectura de layout por frame
        let ticking = false;
        const handleScrollDetect = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
                if (isBottom) {
                    setActiveSection('contact-section');
                }
            });
        };

        window.addEventListener('scroll', handleScrollDetect, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScrollDetect);
            observer.disconnect();
        };
    }, []);

    const handleScroll = (id: string) => {
        scrollToId(id);
    };

    return (
        <>
            {/* Desktop: píldora flotante arriba a la derecha */}
            <nav className="fixed top-6 right-6 z-50 hidden md:flex items-center gap-1.5 p-1.5 bg-background/50 backdrop-blur-xl border border-panel-border rounded-full shadow-2xl transition-all duration-300">
                {navItems.map((item) => {
                    const isActive = activeSection === item.targetId;
                    return (
                        <button
                            key={item.targetId}
                            onClick={() => handleScroll(item.targetId)}
                            className={`px-4 py-2 text-xs font-display font-bold tracking-wider uppercase rounded-full transition-all duration-300 cursor-pointer ${
                                isActive
                                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md shadow-brand-primary/25'
                                    : 'text-text-muted hover:text-foreground hover:bg-foreground/5'
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Móvil: barra superior con scroll horizontal */}
            <nav className="md:hidden fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-panel-border">
                <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.targetId;
                        return (
                            <button
                                key={item.targetId}
                                onClick={() => handleScroll(item.targetId)}
                                className={`shrink-0 px-3 py-1.5 text-[11px] font-display font-bold tracking-wider uppercase rounded-full transition-all duration-300 cursor-pointer ${
                                    isActive
                                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white'
                                        : 'text-text-muted border border-panel-border'
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
