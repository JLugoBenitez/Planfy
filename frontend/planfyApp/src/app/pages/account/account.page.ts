import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { PlanService, UserLikePlan } from '../../services/plan.service';
import { ProgressService, ProgressSnapshot, Achievement } from '../../services/progress.service';

interface Stats {
  total: number;
  ciudadFav: string;
  ciudadFavId?: number;
  categoriaFav: string;
  categoriaFavId?: number;
  gratuitos: number;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss']
})
export class AccountPage implements OnInit {

  userEmail = '';
  userName = '';
  tokenExpiry = '';
  themeMode: 'light' | 'dark' | 'auto' = 'auto';

  stats: Stats = { total: 0, ciudadFav: '—', categoriaFav: '—', gratuitos: 0 };
  statsLoading = true;
  achievements: Achievement[] = [];
  unlockedCount = 0;

  private auth = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastCtrl = inject(ToastController);
  private theme = inject(ThemeService);
  private plans = inject(PlanService);
  private progressSvc = inject(ProgressService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const payload = this.auth.getCurrentPayload();
    if (payload) {
      this.userEmail = payload.sub || '';
      this.userName = this.userEmail.split('@')[0];
      if (payload.exp) this.tokenExpiry = new Date(payload.exp * 1000).toLocaleString('es-ES');
    }
    this.themeMode = this.theme.current();
    this.loadStats();
  }

  private loadStats() {
    this.statsLoading = true;
    this.progressSvc.refresh()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (snap: ProgressSnapshot) => {
          this.statsLoading = false;
          this.achievements = snap.achievements;
          this.unlockedCount = snap.achievements.filter(a => a.unlocked).length;
          this.stats = {
            total: snap.liked,
            gratuitos: snap.achievements.find(a => a.id === 'penny_pincher')?.current ?? 0,
            ciudadFav: snap.topCiudad || '—',
            ciudadFavId: snap.topCiudadId,
            categoriaFav: snap.topCategoria || '—',
            categoriaFavId: snap.topCategoriaId,
          };
        },
        error: () => { this.statsLoading = false; }
      });
  }

  /** Navega al dashboard con el filtro de la categoría top aplicado. */
  exploreTopCategoria() {
    if (this.stats.categoriaFavId) {
      this.router.navigate(['/dashboard'], { queryParams: { categoriaId: this.stats.categoriaFavId } });
    }
  }
  /** Navega al dashboard con el filtro de la ciudad top aplicada. */
  exploreTopCiudad() {
    if (this.stats.ciudadFavId) {
      this.router.navigate(['/dashboard'], { queryParams: { ciudadId: this.stats.ciudadFavId } });
    }
  }
  achievementProgress(a: Achievement): number {
    if (!a.threshold) return 0;
    return Math.min(100, Math.round(((a.current ?? 0) / a.threshold) * 100));
  }

  setTheme(mode: 'light' | 'dark' | 'auto') {
    this.themeMode = mode;
    this.theme.set(mode);
  }
  isTheme(mode: 'light' | 'dark' | 'auto'): boolean { return this.themeMode === mode; }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que quieres salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', role: 'destructive', handler: () => this.auth.logout() }
      ]
    });
    await alert.present();
  }

  async copyEmail() {
    if (!this.userEmail) return;
    try {
      await navigator.clipboard.writeText(this.userEmail);
      const t = await this.toastCtrl.create({
        message: '📋 Email copiado',
        duration: 1500, color: 'primary', position: 'bottom', cssClass: 'planfy-toast'
      });
      await t.present();
    } catch {}
  }

  goToDashboard() { this.router.navigate(['/dashboard']); }
  goToFavorites() { this.router.navigate(['/favorites']); }

  get avatarLetter(): string { return this.userName ? this.userName[0].toUpperCase() : '?'; }
}
