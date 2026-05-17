import { Injectable } from '@angular/core';
import { Plan } from './plan.service';

/**
 * Genera URLs de imagen para cada plan a partir de su categoría/nombre/ciudad.
 * Usa Unsplash Source (sin API key) que devuelve una imagen aleatoria pero
 * estable para una keyword. Si la red bloquea Unsplash, hacemos fallback a un
 * gradiente coloreado por categoría (lo gestiona la página vía error img).
 */

const CATEGORY_KEYWORDS: Record<string, string> = {
  'Cultura':         'museum,art,culture',
  'Naturaleza':      'nature,park,forest,mountain',
  'Gastronomía':     'food,restaurant,tapas,cuisine',
  'Deporte':         'sports,outdoor,gym,running',
  'Ocio nocturno':   'nightlife,bar,club,cocktail',
  'Arte':            'art,gallery,painting',
  'Música':          'music,concert,live-music,flamenco',
  'Aventura':        'adventure,hiking,kayak,surf',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Cultura':         'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
  'Naturaleza':      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  'Gastronomía':     'linear-gradient(135deg, #F97316 0%, #DC2626 100%)',
  'Deporte':         'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
  'Ocio nocturno':   'linear-gradient(135deg, #7C3AED 0%, #1E1B4B 100%)',
  'Arte':            'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
  'Música':          'linear-gradient(135deg, #F59E0B 0%, #DC2626 100%)',
  'Aventura':        'linear-gradient(135deg, #0EA5E9 0%, #1D4ED8 100%)',
};

const FALLBACK_GRADIENT = 'linear-gradient(135deg, #0ECFBE 0%, #0891B2 100%)';

@Injectable({ providedIn: 'root' })
export class ImageService {
  /** Cache de URLs que han fallado para no reintentarlas. */
  private failed = new Set<string>();

  markFailed(url: string) { if (url) this.failed.add(url); }
  hasFailed(url: string): boolean { return this.failed.has(url); }

  /**
   * Cadena de fallback:
   *  1. plan.imagenUrl si está en BBDD (URL temática curada)
   *  2. Loremflickr con keyword de categoría (foto real de Flickr filtrada)
   *  3. Picsum como último recurso (siempre devuelve imagen válida)
   */
  imageFor(plan: Plan, w = 800, h = 600): string {
    // 1. URL en BBDD si no ha fallado
    if (plan.imagenUrl && !this.hasFailed(plan.imagenUrl)) return plan.imagenUrl;
    // 2. Loremflickr temático
    const cat = plan.categoria?.nombre || '';
    const kw = CATEGORY_KEYWORDS[cat] || 'travel,spain';
    const flickr = `https://loremflickr.com/${w}/${h}/${encodeURIComponent(kw)}?lock=${plan.id}`;
    if (!this.hasFailed(flickr)) return flickr;
    // 3. Picsum (último recurso)
    return this.picsumFallback(plan, w, h);
  }

  /** Picsum como último fallback si los anteriores fallan. */
  picsumFallback(plan: Plan, w = 800, h = 600): string {
    const seed = `planfy-${plan.id}-${plan.categoria?.id || 0}`;
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
  }

  /** Gradiente CSS por categoría — fallback inmediato si la imagen falla. */
  gradientFor(plan: Plan): string {
    const cat = plan.categoria?.nombre || '';
    return CATEGORY_GRADIENTS[cat] || FALLBACK_GRADIENT;
  }
}
