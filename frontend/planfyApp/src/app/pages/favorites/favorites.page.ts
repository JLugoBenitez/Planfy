import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { PlanService, Plan, UserLikePlan } from '../../services/plan.service';
import { ImageService } from '../../services/image.service';
import { PlanDetailModalComponent } from '../../components/plan-detail-modal.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, PlanDetailModalComponent],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage implements OnInit {
  favorites: Plan[] = [];
  loading = true;
  error = false;
  errorMessage = '';

  detailOpen = false;
  detailPlan: Plan | null = null;

  private planService = inject(PlanService);
  private images = inject(ImageService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private destroyRef = inject(DestroyRef);

  ngOnInit() { this.loadFavorites(); }

  loadFavorites() {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.planService.getMyLikes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (likes: UserLikePlan[]) => {
          this.loading = false;
          this.favorites = likes.filter(l => l.liked && !!l.plan).map(l => l.plan);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = err?.status === 0
            ? 'Sin conexión con el servidor'
            : 'No se pudieron cargar tus favoritos';
        }
      });
  }

  retry() { this.loadFavorites(); }

  doRefresh(ev: any) {
    this.loadFavorites();
    setTimeout(() => ev?.target?.complete?.(), 800);
  }

  imageFor(plan: Plan): string { return this.images.imageFor(plan, 600, 400); }
  bgImage(plan: Plan): string { return `url(${this.imageFor(plan)})`; }
  onImgError(ev: Event, plan: Plan) {
    const img = ev.target as HTMLImageElement;
    this.images.markFailed(img.src);
    const next = this.images.imageFor(plan, 600, 400);
    if (next !== img.src) img.src = next;
    else img.src = this.images.picsumFallback(plan, 600, 400);
  }
  onImgLoad(ev: Event) {
    (ev.target as HTMLImageElement).classList.add('loaded');
  }

  async removeFavorite(plan: Plan, ev?: Event) {
    if (ev) { ev.stopPropagation(); ev.preventDefault(); }
    const prev = this.favorites;
    this.favorites = this.favorites.filter(f => f.id !== plan.id);

    this.planService.removeVote(plan.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { /* la card ya desapareció del grid: feedback visual suficiente */ },
        error: async () => {
          this.favorites = prev; // rollback
          const t = await this.toastController.create({
            message: 'No se pudo eliminar, inténtalo de nuevo',
            duration: 2400, color: 'danger', position: 'bottom', cssClass: 'planfy-toast'
          });
          await t.present();
        }
      });
  }

  openDetail(plan: Plan) { this.detailPlan = plan; this.detailOpen = true; }
  closeDetail() { this.detailOpen = false; }

  getPrecioLabel(plan: Plan): string {
    if (plan.gratuito) return 'Gratis';
    if (plan.precio) return `${plan.precio}€`;
    return 'Consultar';
  }
  getDuracionLabel(h: number): string {
    if (h < 1) return `${Math.round(h * 60)} min`;
    return `${h}h`;
  }

  goToDashboard() { this.router.navigate(['/dashboard']); }
  goToAccount() { this.router.navigate(['/account']); }
}
