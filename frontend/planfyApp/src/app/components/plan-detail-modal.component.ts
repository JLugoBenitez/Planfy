import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Plan } from '../services/plan.service';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-plan-detail-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
  <div class="overlay" (click)="onBackdrop($event)" *ngIf="open">
    <div class="sheet" role="dialog" aria-modal="true" [attr.aria-label]="plan?.nombre">
      <button class="close-btn" (click)="close.emit()" aria-label="Cerrar">
        <ion-icon name="close"></ion-icon>
      </button>

      <div class="hero" [style.background]="gradient">
        <img class="hero-img" *ngIf="plan" [src]="heroSrc" [alt]="plan.nombre"
             (error)="onImgError($event)" />
        <div class="hero-overlay"></div>
        <span class="cat-badge" *ngIf="plan?.categoria">{{ plan?.categoria?.nombre }}</span>
        <span class="price-badge" [class.free]="plan?.gratuito">{{ priceLabel }}</span>
      </div>

      <div class="body">
        <h2 class="title">{{ plan?.nombre }}</h2>
        <p class="desc">{{ plan?.descripcion }}</p>

        <div class="meta-grid">
          <div class="meta-item" *ngIf="plan?.duracion">
            <ion-icon name="time-outline"></ion-icon>
            <div>
              <span class="meta-label">Duración</span>
              <span class="meta-value">{{ durationLabel }}</span>
            </div>
          </div>
          <div class="meta-item" *ngIf="plan?.ciudad">
            <ion-icon name="location-outline"></ion-icon>
            <div>
              <span class="meta-label">Ciudad</span>
              <span class="meta-value">{{ plan?.ciudad?.nombre }}</span>
            </div>
          </div>
          <div class="meta-item" *ngIf="plan?.categoria">
            <ion-icon name="trophy-outline"></ion-icon>
            <div>
              <span class="meta-label">Tipo</span>
              <span class="meta-value">{{ plan?.categoria?.nombre }}</span>
            </div>
          </div>
        </div>

        <div class="actions">
          <a class="btn btn-secondary" [href]="mapsUrl" target="_blank" rel="noopener">
            <ion-icon name="map-outline"></ion-icon>
            <span>Ver en mapa</span>
          </a>
          <button class="btn btn-primary" (click)="share()">
            <ion-icon name="share-social-outline"></ion-icon>
            <span>Compartir</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    :host { display: contents; }

    .overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(8, 25, 28, 0.55);
      backdrop-filter: blur(6px);
      display: flex; align-items: flex-end; justify-content: center;
      animation: fadeIn .2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .sheet {
      width: 100%; max-width: 640px; max-height: 92vh;
      background: var(--p-surface);
      border-radius: 28px 28px 0 0;
      overflow: hidden;
      animation: slideUp .28s cubic-bezier(0.34, 1.2, 0.64, 1);
      display: flex; flex-direction: column;
      box-shadow: var(--p-shadow-lg);
      position: relative;
    }
    @media (min-width: 680px) {
      .overlay { align-items: center; }
      .sheet { border-radius: 28px; }
    }

    .close-btn {
      position: absolute; top: 14px; right: 14px;
      z-index: 2;
      width: 38px; height: 38px;
      border-radius: 50%;
      background: rgba(255,255,255,0.95);
      border: none;
      display: flex; align-items: center; justify-content: center;
      color: #1a3a3a;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: transform .15s;
      &:active { transform: scale(0.92); }
      ion-icon { font-size: 20px; }
    }

    .hero {
      height: 220px;
      position: relative;
      overflow: hidden;
    }
    .hero-img {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      background: var(--planfy-grad);
    }
    .hero-overlay {
      position: absolute; inset: 0; z-index: 1;
      background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45) 100%);
    }
    .cat-badge, .price-badge { z-index: 2; }

    .cat-badge {
      position: absolute; top: 18px; left: 18px;
      padding: 6px 14px;
      background: rgba(255,255,255,0.95);
      color: var(--planfy-2);
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .price-badge {
      position: absolute; bottom: 18px; right: 18px;
      padding: 8px 16px;
      background: rgba(255,255,255,0.95);
      color: var(--planfy-2);
      border-radius: 14px;
      font-size: 16px;
      font-weight: 900;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      &.free { background: var(--planfy-grad); color: white; }
    }

    .body {
      padding: 22px 22px 28px;
      overflow-y: auto;
      flex: 1;
    }
    .title {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 800;
      color: var(--p-text);
      line-height: 1.2;
    }
    .desc {
      margin: 0 0 20px;
      font-size: 14px;
      color: var(--p-text-muted);
      line-height: 1.55;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }
    .meta-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px;
      background: var(--planfy-4);
      border: 1px solid var(--p-border);
      border-radius: 14px;
      ion-icon { font-size: 22px; color: var(--planfy-2); flex-shrink: 0; }
      div { display: flex; flex-direction: column; min-width: 0; }
      .meta-label { font-size: 10px; font-weight: 700; color: var(--p-text-muted); text-transform: uppercase; letter-spacing: 0.4px; }
      .meta-value { font-size: 13px; font-weight: 600; color: var(--p-text); }
    }

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px;
      border: none;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: transform .15s, box-shadow .15s;
      text-decoration: none;
      ion-icon { font-size: 18px; }
      &:active { transform: scale(0.97); }
    }
    .btn-primary {
      background: var(--planfy-grad); color: white;
      box-shadow: 0 6px 18px rgba(8,145,178,0.35);
    }
    .btn-secondary {
      background: var(--p-surface-2); color: var(--planfy-2);
      border: 1px solid var(--p-border);
    }
  `]
})
export class PlanDetailModalComponent implements OnInit {
  @Input() plan: Plan | null = null;
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  private images = inject(ImageService);
  private toastCtrl = inject(ToastController);

  ngOnInit() {}

  get heroSrc(): string {
    return this.plan ? this.images.imageFor(this.plan, 800, 480) : '';
  }
  get gradient(): string {
    return this.plan ? this.images.gradientFor(this.plan) : 'linear-gradient(135deg, #0ECFBE 0%, #0891B2 100%)';
  }
  onImgError(ev: Event) {
    if (!this.plan) return;
    const img = ev.target as HTMLImageElement;
    this.images.markFailed(img.src);
    const next = this.images.imageFor(this.plan, 800, 480);
    img.src = next !== img.src ? next : this.images.picsumFallback(this.plan, 800, 480);
  }
  get priceLabel(): string {
    if (!this.plan) return '';
    if (this.plan.gratuito) return 'Gratis';
    if (this.plan.precio) return `${this.plan.precio} €`;
    return 'Consultar';
  }
  get durationLabel(): string {
    const h = this.plan?.duracion;
    if (!h) return '';
    if (h < 1) return `${Math.round(h * 60)} min`;
    return `${h} h`;
  }
  get mapsUrl(): string {
    if (!this.plan) return '#';
    if (this.plan.latitud && this.plan.longitud)
      return `https://maps.google.com/?q=${this.plan.latitud},${this.plan.longitud}`;
    return `https://maps.google.com/?q=${encodeURIComponent(this.plan.nombre)}`;
  }

  onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('overlay')) {
      this.close.emit();
    }
  }

  async share() {
    if (!this.plan) return;
    const text = `Echa un ojo a "${this.plan.nombre}" en Planfy${this.plan.ciudad ? ' (' + this.plan.ciudad.nombre + ')' : ''}.`;
    const url = this.mapsUrl;
    const data = { title: this.plan.nombre, text, url };

    if ((navigator as any).share) {
      try {
        await (navigator as any).share(data);
        return;
      } catch {
        // Cancelado por el usuario u otro error → fallback
      }
    }

    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      const t = await this.toastCtrl.create({
        message: '🔗 Link copiado al portapapeles',
        duration: 2000,
        position: 'bottom',
        cssClass: 'planfy-toast',
        color: 'primary',
      });
      await t.present();
    } catch {
      const t = await this.toastCtrl.create({
        message: 'No se pudo compartir',
        duration: 2000,
        color: 'danger',
        cssClass: 'planfy-toast',
      });
      await t.present();
    }
  }
}
