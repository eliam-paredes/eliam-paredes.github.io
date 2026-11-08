import type Lenis from 'lenis';

// Instancia compartida de Lenis para que los botones de navegación
// usen el mismo scroll suave en lugar de competir con scrollIntoView.
let lenisInstance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => { lenisInstance = l; };

export function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisInstance) lenisInstance.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth' });
}
