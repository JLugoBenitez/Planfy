import { Component, DestroyRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

import { PlanService, Plan, SwipeFilters, SwipeResult, isNoMorePlans } from '../../services/plan.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { MetaService, Ciudad, Categoria } from '../../services/meta.service';
import { ProgressService, ProgressSnapshot } from '../../services/progress.service';
import { PlanDetailModalComponent } from '../../components/plan-detail-modal.component';
import { ActivatedRoute } from '@angular/router';

type SwipeDir = 'left' | 'right' | null;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PlanDetailModalComponent],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {

  // ─── State principal ─────────────────────────────────────
  currentPlan: Plan | null = null;
  nextPlan: Plan | null = null;
  loading = true;
  noMore = false;
  swipeDir: SwipeDir = null;
  showFilters = false;
  showSearch = false;

  // Para que la app no luzca vacía si /swipe ya no devuelve más planes,
  // mostramos planes "explora" en modo discover usando shuffle/random.
  discoverMode = false;
  discoverPool: Plan[] = [];

  // ─── Filtros ─────────────────────────────────────────────
  filters: SwipeFilters = {};
  soloGratuitos = false;
  ciudades: Ciudad[] = [];
  categorias: Categoria[] = [];
  searchQuery = '';

  // ─── Detalle ─────────────────────────────────────────────
  detailOpen = false;
  detailPlan: Plan | null = null;

  // ─── Undo (deshacer última acción) ───────────────────────
  lastSwipe: { plan: Plan; dir: 'left' | 'right' } | null = null;

  // ─── Progreso ────────────────────────────────────────────
  progress: ProgressSnapshot | null = null;

  // ─── Onboarding tour ─────────────────────────────────────
  tourStep = 0;       // 0 = oculto, 1..3 = paso visible
  private TOUR_KEY = 'planfy_tour_done';

  // ─── Drag ────────────────────────────────────────────────
  dragX = 0;
  dragY = 0;
  isDragging = false;
  private startX = 0;
  private startY = 0;

  // Timers
  private advanceTimer: ReturnType<typeof setTimeout> | null = null;
  private preloading = false;

  private planService = inject(PlanService);
  private auth = inject(AuthService);
  private meta = inject(MetaService);
  private images = inject(ImageService);
  private progressSvc = inject(ProgressService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loadMeta();

    // Si llega un queryParam con filtros (desde Cuenta → "Ver más de X"), aplícalos
    const qp = this.route.snapshot.queryParamMap;
    const ciudadId = qp.get('ciudadId'); if (ciudadId) this.filters.ciudadId = Number(ciudadId);
    const categoriaId = qp.get('categoriaId'); if (categoriaId) this.filters.categoriaId = Number(categoriaId);

    // Cargar progreso para counter en header
    this.refreshProgress();

    // Onboarding tour si es la primera vez
    try {
      if (!localStorage.getItem(this.TOUR_KEY)) this.tourStep = 1;
    } catch {}

    this.loadNextPlan();
  }

  refreshProgress() {
    this.progressSvc.refresh()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (snap) => { this.progress = snap; },
        error: () => { /* silencioso, no es crítico */ }
      });
  }

  ngOnDestroy() {
    if (this.advanceTimer) {
      clearTimeout(this.advanceTimer);
      this.advanceTimer = null;
    }
  }

  private loadMeta() {
    this.meta.getCiudades().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(c => this.ciudades = c);
    this.meta.getCategorias().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(c => this.categorias = c);
  }

  // ─── Imagen ──────────────────────────────────────────────
  imageUrl(plan: Plan | null): string {
    return plan ? this.images.imageFor(plan, 800, 600) : '';
  }
  gradient(plan: Plan | null): string {
    return plan ? this.images.gradientFor(plan) : '';
  }
  /** Cuando una imagen falla, marca como rota y reasigna usando la cadena de fallback. */
  onImgError(ev: Event, plan: Plan | null) {
    if (!plan) return;
    const img = ev.target as HTMLImageElement;
    const failedUrl = img.src;
    this.images.markFailed(failedUrl);
    const next = this.images.imageFor(plan, 800, 600);
    if (next !== failedUrl) {
      img.src = next;
    } else {
      // último recurso: picsum
      img.src = this.images.picsumFallback(plan, 800, 600);
    }
  }

  /** Marca la imagen como ya cargada para hacer fade-in suave (evita corte). */
  onImgLoad(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  // ─── Cargar plan ─────────────────────────────────────────
  loadNextPlan() {
    this.loading = true;
    const f = this.activeFilters();

    this.planService.getSwipe(f)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: SwipeResult) => {
          this.loading = false;
          if (isNoMorePlans(res)) {
            // No hay más planes nuevos → entrar en modo discover con random
            this.startDiscoverMode();
          } else {
            this.discoverMode = false;
            this.currentPlan = res;
            this.warmImage(res);
            this.noMore = false;
            this.preloadNext(f);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          if (err.status !== 401) {
            this.showToast('Error cargando planes', 'danger');
          }
        }
      });
  }

  private preloadNext(f: SwipeFilters) {
    if (this.preloading) return;
    this.preloading = true;
    this.planService.getSwipe(f)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: SwipeResult) => {
          this.preloading = false;
          if (!isNoMorePlans(res)) {
            this.nextPlan = res;
            this.warmImage(res);
          } else {
            this.nextPlan = null;
          }
        },
        error: () => { this.preloading = false; }
      });
  }

  /** Precarga la imagen del siguiente plan para que el cambio sea instantáneo. */
  private warmImage(plan: Plan) {
    if (!plan) return;
    const url = this.images.imageFor(plan, 800, 600);
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    // Fallback: si la URL falla, marcamos como rota y precargamos la siguiente
    img.onerror = () => {
      this.images.markFailed(url);
      const next = this.images.imageFor(plan, 800, 600);
      if (next !== url) {
        const retry = new Image();
        retry.src = next;
      }
    };
  }

  /** Cuando se acaban los swipe-pendientes, cargamos planes aleatorios. */
  private startDiscoverMode() {
    this.discoverMode = true;
    this.noMore = false;
    this.loadDiscoverCard();
  }

  private loadDiscoverCard() {
    const f = this.activeFilters();
    this.planService.getShuffle({
      ciudadId: f.ciudadId,
      categoriaId: f.categoriaId,
      precioMax: f.precioMax,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (p) => { this.currentPlan = p; this.preloadDiscoverNext(); },
        error: () => { this.noMore = true; this.currentPlan = null; }
      });
  }

  private preloadDiscoverNext() {
    if (this.preloading) return;
    this.preloading = true;
    const f = this.activeFilters();
    this.planService.getShuffle({
      ciudadId: f.ciudadId,
      categoriaId: f.categoriaId,
      precioMax: f.precioMax,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (p) => { this.preloading = false; this.nextPlan = p; this.warmImage(p); },
        error: () => { this.preloading = false; }
      });
  }

  private activeFilters(): SwipeFilters {
    const f: SwipeFilters = { ...this.filters };
    if (this.soloGratuitos) f.gratuito = true;
    return f;
  }

  // ─── Like / Dislike ──────────────────────────────────────
  async doLike() {
    if (!this.currentPlan || this.swipeDir) return;
    const plan = this.currentPlan;
    this.swipeDir = 'right';
    this.lastSwipe = { plan, dir: 'right' };
    this.progressSvc.incLocalSwipes();

    await this.delay(350);
    this.planService.like(plan.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.refreshProgress(); }, // sin toast: el feedback visual del swipe ya lo deja claro
        error: (err: HttpErrorResponse) => {
          if (err.status !== 401) this.showToast('No se pudo guardar el like', 'danger');
        }
      });
    this.advanceCard();
  }

  async doDislike() {
    if (!this.currentPlan || this.swipeDir) return;
    const plan = this.currentPlan;
    this.swipeDir = 'left';
    this.lastSwipe = { plan, dir: 'left' };
    this.progressSvc.incLocalSwipes();
    await this.delay(350);
    this.planService.dislike(plan.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.refreshProgress(),
        error: () => { /* silencioso */ }
      });
    this.advanceCard();
  }

  /** Deshace la última acción: revierte el voto en backend y trae el plan otra vez. */
  undoLastSwipe() {
    if (!this.lastSwipe) return;
    const { plan } = this.lastSwipe;
    this.lastSwipe = null;

    this.planService.removeVote(plan.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.currentPlan) this.nextPlan = this.currentPlan;
          this.currentPlan = plan;
          this.swipeDir = null;
          this.dragX = 0; this.dragY = 0;
          this.refreshProgress(); // la card que vuelve a aparecer ya es feedback suficiente
        },
        error: () => this.showToast('No se pudo deshacer', 'danger')
      });
  }

  /** Pull-to-refresh: vacía caché de planes y reintenta. */
  doRefresh(ev: any) {
    this.nextPlan = null;
    this.noMore = false;
    this.discoverMode = false;
    this.loadNextPlan();
    this.refreshProgress();
    setTimeout(() => ev?.target?.complete?.(), 800);
  }

  // ─── Onboarding tour ─────────────────────────────────────
  nextTourStep() {
    if (this.tourStep < 3) this.tourStep++;
    else this.closeTour();
  }
  closeTour() {
    this.tourStep = 0;
    try { localStorage.setItem(this.TOUR_KEY, '1'); } catch {}
  }

  private advanceCard() {
    if (this.advanceTimer) clearTimeout(this.advanceTimer);
    this.advanceTimer = setTimeout(() => {
      this.advanceTimer = null;
      this.swipeDir = null;
      this.dragX = 0;
      this.dragY = 0;
      if (this.nextPlan) {
        this.currentPlan = this.nextPlan;
        this.nextPlan = null;
        if (this.discoverMode) this.preloadDiscoverNext();
        else this.preloadNext(this.activeFilters());
      } else {
        if (this.discoverMode) this.loadDiscoverCard();
        else this.loadNextPlan();
      }
    }, 150);
  }

  // ─── Touch / mouse drag ──────────────────────────────────
  onTouchStart(e: TouchEvent) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.isDragging = true;
  }
  onTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    this.dragX = e.touches[0].clientX - this.startX;
    this.dragY = e.touches[0].clientY - this.startY;
  }
  onTouchEnd() {
    this.isDragging = false;
    if (Math.abs(this.dragX) > 80) {
      if (this.dragX > 0) this.doLike();
      else this.doDislike();
    } else { this.dragX = 0; this.dragY = 0; }
  }
  onMouseDown(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('.tap-zone-info, .meta-chip, .info-btn')) return;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.isDragging = true;
  }
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    this.dragX = e.clientX - this.startX;
    this.dragY = e.clientY - this.startY;
  }
  @HostListener('document:mouseup')
  onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (Math.abs(this.dragX) > 80) {
      if (this.dragX > 0) this.doLike();
      else this.doDislike();
    } else { this.dragX = 0; this.dragY = 0; }
  }
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (this.detailOpen) {
      if (e.key === 'Escape') this.closeDetail();
      return;
    }
    if (this.showSearch || this.showFilters) return;
    if (e.key === 'ArrowRight') this.doLike();
    else if (e.key === 'ArrowLeft') this.doDislike();
  }

  // ─── Card transform ──────────────────────────────────────
  get cardTransform(): string {
    if (this.swipeDir === 'right') return 'translateX(120vw) rotate(20deg)';
    if (this.swipeDir === 'left') return 'translateX(-120vw) rotate(-20deg)';
    const rotate = this.dragX * 0.08;
    return `translateX(${this.dragX}px) translateY(${this.dragY * 0.3}px) rotate(${rotate}deg)`;
  }
  get likeOpacity(): number { return Math.min(Math.max(this.dragX / 100, 0), 1); }
  get nopeOpacity(): number { return Math.min(Math.max(-this.dragX / 100, 0), 1); }

  // ─── Filtros ─────────────────────────────────────────────
  toggleFilters() { this.showFilters = !this.showFilters; if (this.showFilters) this.showSearch = false; }
  toggleSearch() { this.showSearch = !this.showSearch; if (this.showSearch) this.showFilters = false; }

  applyFilters() {
    this.showFilters = false;
    this.nextPlan = null;
    this.noMore = false;
    this.discoverMode = false;
    this.loadNextPlan();
  }
  resetFilters() {
    this.filters = {};
    this.soloGratuitos = false;
    this.searchQuery = '';
    this.applyFilters();
  }
  hasActiveFilter(): boolean {
    return !!(this.filters.ciudadId || this.filters.categoriaId || this.filters.precioMax || this.soloGratuitos);
  }

  applySearch() {
    // Si hay query, intentamos extraer ciudad o categoría que coincida
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) { this.applyFilters(); return; }

    const matchCiudad = this.ciudades.find(c => c.nombre.toLowerCase().includes(q));
    const matchCat = this.categorias.find(c => c.nombre.toLowerCase().includes(q));
    this.filters.ciudadId = matchCiudad?.id;
    this.filters.categoriaId = matchCat?.id;

    this.showSearch = false;
    this.applyFilters();
    // El cambio en la card aplicada es feedback suficiente; solo avisamos si NO hubo match
    if (!matchCiudad && !matchCat) {
      this.showToast('Sin coincidencias en ciudades o categorías', 'medium');
    }
  }

  // ─── Detalle ─────────────────────────────────────────────
  openDetail(plan: Plan | null) {
    if (!plan) return;
    this.detailPlan = plan;
    this.detailOpen = true;
  }
  closeDetail() {
    this.detailOpen = false;
  }

  // ─── Navegación ──────────────────────────────────────────
  goToFavorites() { this.router.navigate(['/favorites']); }
  goToAccount() { this.router.navigate(['/account']); }
  logout() { this.auth.logout(); }

  // ─── Utils ───────────────────────────────────────────────
  getDuracionLabel(h: number): string {
    if (h < 1) return `${Math.round(h * 60)} min`;
    return `${h}h`;
  }
  getPrecioLabel(plan: Plan): string {
    if (plan.gratuito) return 'Gratis';
    if (plan.precio) return `${plan.precio}€`;
    return 'Consultar';
  }
  getMapsUrl(plan: Plan): string {
    if (plan.latitud && plan.longitud) return `https://maps.google.com/?q=${plan.latitud},${plan.longitud}`;
    return `https://maps.google.com/?q=${encodeURIComponent(plan.nombre)}`;
  }

  private async showToast(message: string, color: string) {
    const t = await this.toastController.create({
      message, duration: 2500, color, position: 'bottom', cssClass: 'planfy-toast'
    });
    await t.present();
  }
  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
