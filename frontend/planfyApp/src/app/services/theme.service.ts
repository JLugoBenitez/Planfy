import { Injectable } from '@angular/core';

const KEY = 'planfy_theme';
type Mode = 'light' | 'dark' | 'auto';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  init() {
    const mode = (this.read() ?? 'auto') as Mode;
    this.apply(mode);
  }

  current(): Mode {
    return (this.read() ?? 'auto') as Mode;
  }

  set(mode: Mode) {
    try { localStorage.setItem(KEY, mode); } catch {}
    this.apply(mode);
  }

  toggle(): Mode {
    const next: Mode = this.current() === 'dark' ? 'light' : 'dark';
    this.set(next);
    return next;
  }

  private read(): string | null {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }

  private apply(mode: Mode) {
    const html = document.documentElement;
    html.classList.remove('dark', 'auto-theme');
    if (mode === 'dark') html.classList.add('dark');
    else if (mode === 'auto') html.classList.add('auto-theme');
    // 'light' = sin clases
  }
}
