import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController, AnimationController } from '@ionic/angular';

import { PlanService, Plan, SwipeFilters } from '../../services/plan.service';
import { StorageService } from '../../services/storage.service';

type SwipeDir = 'left' | 'right' | null;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  // ─── State ───────────────────────────────────────────────
  currentPlan: Plan | null = null;
  nextPlan: Plan | null = null;
  loading = true;
  noMore = false;
  swipeDir: SwipeDir = null;
  showFilters = false;

  // ─── Filtros ─────────────────────────────────────────────
  filters: SwipeFilters = {};
  soloGratuitos = false;

  // ─── Touch / drag ────────────────────────────────────────
  dragX = 0;
  dragY = 0;
  isDragging = false;
  private startX = 0;
  private startY = 0;

  constructor(
    private planService: PlanService,
    private storageService: StorageService,
    private router: Router,
    private toastController: ToastController,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    this.loadNextPlan();
  }

  // ─── Cargar plan ─────────────────────────────────────────
  loadNextPlan() {
    this.loading = true;
    const f: SwipeFilters = { ...this.filters };
    if (this.soloGratuitos) f.gratuito = true;

    this.planService.getSwipe(f).subscribe({
      next: (res) => {
        this.loading = false;
        if ('message' in res) {
          this.noMore = true;
          this.currentPlan = null;
        } else {
          this.currentPlan = res as Plan;
          this.noMore = false;
          // Precargar el siguiente
          this.preloadNext(f);
        }
      },
      error: () => {
        this.loading = false;
        this.showToast('Error cargando planes', 'danger');
      }
    });
  }

  preloadNext(f: SwipeFilters) {
    this.planService.getSwipe(f).subscribe({
      next: (res) => {
        if (!('message' in res)) this.nextPlan = res as Plan;
      },
      error: () => {}
    });
  }

  // ─── Like / Dislike ──────────────────────────────────────
  async doLike() {
    if (!this.currentPlan || this.swipeDir) return;
    const plan = this.currentPlan;
    this.swipeDir = 'right';

    await this.delay(350);
    this.planService.like(plan.id).subscribe({
      next: () => this.showToast('¡Plan guardado en favoritos! ❤️', 'success'),
      error: () => {}
    });
    this.advanceCard();
  }

  async doDislike() {
    if (!this.currentPlan || this.swipeDir) return;
    this.swipeDir = 'left';
    await this.delay(350);
    this.advanceCard();
  }

  private advanceCard() {
    setTimeout(() => {
      this.swipeDir = null;
      this.dragX = 0;
      this.dragY = 0;
      if (this.nextPlan) {
        this.currentPlan = this.nextPlan;
        this.nextPlan = null;
        const f: SwipeFilters = { ...this.filters };
        if (this.soloGratuitos) f.gratuito = true;
        this.preloadNext(f);
      } else {
        this.loadNextPlan();
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
    } else {
      this.dragX = 0;
      this.dragY = 0;
    }
  }

  onMouseDown(e: MouseEvent) {
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
    } else {
      this.dragX = 0;
      this.dragY = 0;
    }
  }

  // ─── Card transform ──────────────────────────────────────
  get cardTransform(): string {
    if (this.swipeDir === 'right') return 'translateX(120vw) rotate(20deg)';
    if (this.swipeDir === 'left') return 'translateX(-120vw) rotate(-20deg)';
    const rotate = this.dragX * 0.08;
    return `translateX(${this.dragX}px) translateY(${this.dragY * 0.3}px) rotate(${rotate}deg)`;
  }

  get likeOpacity(): number {
    return Math.min(Math.max(this.dragX / 100, 0), 1);
  }

  get nopeOpacity(): number {
    return Math.min(Math.max(-this.dragX / 100, 0), 1);
  }

  // ─── Filtros ─────────────────────────────────────────────
  toggleFilters() { this.showFilters = !this.showFilters; }

  applyFilters() {
    this.showFilters = false;
    this.nextPlan = null;
    this.noMore = false;
    this.loadNextPlan();
  }

  resetFilters() {
    this.filters = {};
    this.soloGratuitos = false;
    this.applyFilters();
  }

  // ─── Navegación ──────────────────────────────────────────
  goToFavorites() { this.router.navigate(['/favorites']); }
  goToAccount() { this.router.navigate(['/account']); }

  logout() {
    this.storageService.clearAll();
    this.router.navigate(['/login']);
  }

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
    if (plan.latitud && plan.longitud) {
      return `https://maps.google.com/?q=${plan.latitud},${plan.longitud}`;
    }
    return `https://maps.google.com/?q=${encodeURIComponent(plan.nombre)}`;
  }

  private async showToast(message: string, color: string) {
    const t = await this.toastController.create({ message, duration: 2000, color, position: 'top' });
    await t.present();
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
