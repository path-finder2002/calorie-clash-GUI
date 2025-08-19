export function ensureGsap(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as unknown as { gsap?: unknown }).gsap) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}
