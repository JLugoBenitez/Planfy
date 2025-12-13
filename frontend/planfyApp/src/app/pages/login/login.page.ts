import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

import { Auth} from '../../app/services/auth.service';
import { StorageService } from '../../app/services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: Auth,
    private storageService: StorageService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: async (res) => {
        this.loading = false;
        this.storageService.setToken(res.token);

        const toast = await this.toastController.create({
          message: 'Inicio de sesión correcto ✅',
          duration: 1500,
          color: 'success'
        });
        await toast.present();

        this.router.navigate(['/dashboard']);
      },
      error: async () => {
        this.loading = false;
        const toast = await this.toastController.create({
          message: 'Credenciales incorrectas ❌',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
