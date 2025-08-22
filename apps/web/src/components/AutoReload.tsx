import { useEffect, useRef } from 'react';

const VERSION_URL = '/version.json';

export default function AutoReload() {
  const currentRef = useRef<string | null>(typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) return; // 開発時は HMR に任せる

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(VERSION_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`bad status ${res.status}`);
        const data = (await res.json()) as { version?: string };
        const next = data?.version ?? null;

        if (!cancelled) {
          if (currentRef.current == null) {
            currentRef.current = next; // 初回読み込み
          } else if (next && currentRef.current && next !== currentRef.current) {
            // タブがアクティブな時にのみリロード（キオスクでの体験向上）
            if (!document.hidden) {
              window.location.reload();
            }
          }
        }
      } catch {
        // ネットワーク断などは無視して次回ポーリング
      } finally {
        if (!cancelled) {
          timerRef.current = window.setTimeout(poll, 60_000); // 60秒ごと
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}

