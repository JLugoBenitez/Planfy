import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, map, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PlanService, UserLikePlan } from './plan.service';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;          // ionicon name
  threshold: number;     // valor numérico que desbloquea el logro
  metric: 'likes' | 'totalSwipes' | 'cities' | 'categories' | 'gratuitos';
  unlocked?: boolean;
  current?: number;
}

export interface ProgressSnapshot {
  totalPlanes: number;       // planes existentes en BBDD
  liked: number;             // mis likes
  disliked: number;          // mis dislikes (estimación local)
  seen: number;              // liked + disliked (planes ya votados)
  remaining: number;         // total - seen
  topCategoria?: string;
  topCategoriaId?: number;
  topCiudad?: string;
  topCiudadId?: number;
  achievements: Achievement[];
}

const SWIPE_KEY = 'planfy_local_swipes';

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_match',  name: 'Primer match',    description: 'Da tu primer like a un plan',    icon: 'heart',                threshold: 1,  metric: 'likes' },
  { id: 'collector',    name: 'Coleccionista',   description: 'Llega a 10 favoritos',           icon: 'star',                 threshold: 10, metric: 'likes' },
  { id: 'adventurer',   name: 'Aventurero',      description: 'Reúne 25 favoritos',             icon: 'trophy-outline',       threshold: 25, metric: 'likes' },
  { id: 'curator',      name: 'Curador master',  description: 'Reúne 50 favoritos',             icon: 'trophy-outline',       threshold: 50, metric: 'likes' },
  { id: 'explorer',     name: 'Explorador',      description: 'Vota en 20 planes (likes + nope)', icon: 'compass',            threshold: 20, metric: 'totalSwipes' },
  { id: 'globetrotter', name: 'Trotamundos',     description: 'Te gustan planes de 3 ciudades distintas', icon: 'location-outline', threshold: 3, metric: 'cities' },
  { id: 'eclectic',     name: 'Ecléctico',       description: 'Likes en 4 categorías distintas', icon: 'star-outline',         threshold: 4,  metric: 'categories' },
  { id: 'penny_pincher',name: 'Sin gastar',      description: '5 favoritos gratuitos',          icon: 'star',                 threshold: 5,  metric: 'gratuitos' },
];

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private http = inject(HttpClient);
  private planService = inject(PlanService);
  private apiUrl = environment.apiUrl;

  private snapshot$ = new BehaviorSubject<ProgressSnapshot | null>(null);

  /** Counter local de swipes (likes + dislikes) en este dispositivo */
  incLocalSwipes(): number {
    const cur = this.getLocalSwipes() + 1;
    try { localStorage.setItem(SWIPE_KEY, String(cur)); } catch {}
    return cur;
  }
  getLocalSwipes(): number {
    try { return Number(localStorage.getItem(SWIPE_KEY) || '0') || 0; } catch { return 0; }
  }

  observe(): Observable<ProgressSnapshot | null> {
    return this.snapshot$.asObservable();
  }

  /** Recarga snapshot pidiendo planes totales + mis likes. */
  refresh(): Observable<ProgressSnapshot> {
    const total$ = this.http.get<unknown[]>(`${this.apiUrl}/plans`)
      .pipe(map(arr => arr.length), catchError(() => of(0)));
    const likes$ = this.planService.getMyLikes().pipe(catchError(() => of([] as UserLikePlan[])));

    return combineLatest([total$, likes$]).pipe(
      map(([total, all]) => {
        const liked = all.filter(l => l.liked && l.plan);
        const dislikes = all.filter(l => !l.liked).length;
        const seen = liked.length + dislikes;

        // Categoría / ciudad top
        const countBy = <T>(items: { plan: any }[], pick: (p: any) => T | undefined) => {
          const map = new Map<T, number>();
          for (const i of items) {
            const v = pick(i.plan);
            if (v != null) map.set(v, (map.get(v) || 0) + 1);
          }
          let bestKey: T | undefined; let bestN = 0;
          for (const [k, n] of map) if (n > bestN) { bestN = n; bestKey = k; }
          return bestKey;
        };
        const topCat = countBy(liked, p => p.categoria?.id);
        const topCity = countBy(liked, p => p.ciudad?.id);
        const topCatName = liked.find(l => l.plan.categoria?.id === topCat)?.plan.categoria?.nombre;
        const topCityName = liked.find(l => l.plan.ciudad?.id === topCity)?.plan.ciudad?.nombre;

        const cities = new Set(liked.map(l => l.plan.ciudad?.id).filter(Boolean)).size;
        const categories = new Set(liked.map(l => l.plan.categoria?.id).filter(Boolean)).size;
        const gratuitos = liked.filter(l => l.plan.gratuito).length;
        const totalSwipes = Math.max(seen, this.getLocalSwipes());

        const metricValue = (m: Achievement['metric']) => {
          switch (m) {
            case 'likes': return liked.length;
            case 'totalSwipes': return totalSwipes;
            case 'cities': return cities;
            case 'categories': return categories;
            case 'gratuitos': return gratuitos;
          }
        };

        const achievements: Achievement[] = ACHIEVEMENTS.map(a => ({
          ...a,
          current: metricValue(a.metric),
          unlocked: metricValue(a.metric) >= a.threshold,
        }));

        const snap: ProgressSnapshot = {
          totalPlanes: total,
          liked: liked.length,
          disliked: dislikes,
          seen,
          remaining: Math.max(0, total - seen),
          topCategoria: topCatName,
          topCategoriaId: topCat as number | undefined,
          topCiudad: topCityName,
          topCiudadId: topCity as number | undefined,
          achievements,
        };
        this.snapshot$.next(snap);
        return snap;
      })
    );
  }
}
