export function ensureGsap(timeout = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as unknown as { gsap?: unknown }).gsap) {
      resolve(true);
      return;
    }

    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.async = true;

    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(tid);
      resolve(ok);
    };

    const tid = setTimeout(() => finish(false), timeout);
    s.onload = () => finish(true);
    s.onerror = () => finish(false);

    document.head.appendChild(s);
  });
}
