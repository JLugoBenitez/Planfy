import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

function parseJwt(token: string): any {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch { return null; }
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

  constructor(
    private storageService: StorageService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const token = this.storageService.getToken();
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        this.userEmail = payload.sub || '';
        this.userName = this.userEmail.split('@')[0];
        if (payload.exp) {
          const d = new Date(payload.exp * 1000);
          this.tokenExpiry = d.toLocaleString('es-ES');
        }
      }
    }
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que quieres salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          role: 'destructive',
          handler: () => {
            this.storageService.clearAll();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  goToDashboard() { this.router.navigate(['/dashboard']); }
  goToFavorites() { this.router.navigate(['/favorites']); }

  get avatarLetter(): string {
    return this.userName ? this.userName[0].toUpperCase() : '?';
  }
}
