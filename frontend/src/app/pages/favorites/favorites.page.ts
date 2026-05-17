import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { PlanService, Plan } from '../../services/plan.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage implements OnInit {

  favorites: Plan[] = [];
  loading = true;
  error = false;

  constructor(
    private planService: PlanService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() { this.loadFavorites(); }

  loadFavorites() {
    this.loading = true;
    this.error = false;

    this.planService.getMyLikes().subscribe({
      next: (likes) => {
        this.loading = false;
        // El backend devuelve UserLikePlan con el plan dentro
        this.favorites = likes
          .filter((l: any) => l.liked)
          .map((l: any) => l.plan);
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  async removeFavorite(plan: Plan) {
    this.planService.removeVote(plan.id).subscribe({
      next: async () => {
        this.favorites = this.favorites.filter(f => f.id !== plan.id);
        const t = await this.toastController.create({
          message: 'Eliminado de favoritos',
          duration: 1800, color: 'medium', position: 'top'
        });
        await t.present();
      },
      error: () => {}
    });
  }

  getPrecioLabel(plan: Plan): string {
    if (plan.gratuito) return 'Gratis';
    if (plan.precio) return `${plan.precio}€`;
    return 'Consultar';
  }

  getDuracionLabel(h: number): string {
    if (h < 1) return `${Math.round(h * 60)} min`;
    return `${h}h`;
  }

  getMapsUrl(plan: Plan): string {
    if (plan.latitud && plan.longitud)
      return `https://maps.google.com/?q=${plan.latitud},${plan.longitud}`;
    return `https://maps.google.com/?q=${encodeURIComponent(plan.nombre)}`;
  }

  goToDashboard() { this.router.navigate(['/dashboard']); }
  goToAccount() { this.router.navigate(['/account']); }
}
