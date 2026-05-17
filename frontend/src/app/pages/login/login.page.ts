import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {

  // ─── Login ───────────────────────────────────────────────
  loginEmail = '';
  loginPassword = '';

  // ─── Register ────────────────────────────────────────────
  registerNombre = '';
  registerEmail = '';
  registerPassword = '';

  showRegister = false;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  // ─── Toggle flip card ────────────────────────────────────
  goToRegister() { this.showRegister = true; }
  goToLogin() { this.showRegister = false; }

  // ─── Login ───────────────────────────────────────────────
  async login() {
    if (!this.loginEmail || !this.loginPassword) {
      return this.showToast('Rellena todos los campos', 'warning');
    }

    const loading = await this.loadingController.create({ message: 'Entrando...', spinner: 'crescent' });
    await loading.present();

    this.authService.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.storageService.setToken(res.token);
        this.storageService.setRefreshToken(res.refreshToken);
        await this.showToast('¡Bienvenido a Planfy! 🎉', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: async () => {
        await loading.dismiss();
        await this.showToast('Email o contraseña incorrectos ❌', 'danger');
      }
    });
  }

  // ─── Register ────────────────────────────────────────────
  async register() {
    if (!this.registerNombre || !this.registerEmail || !this.registerPassword) {
      return this.showToast('Rellena todos los campos', 'warning');
    }
    if (this.registerPassword.length < 6) {
      return this.showToast('La contraseña debe tener mínimo 6 caracteres', 'warning');
    }

    const loading = await this.loadingController.create({ message: 'Creando cuenta...', spinner: 'crescent' });
    await loading.present();

    this.authService.register({
      nombre: this.registerNombre,
      email: this.registerEmail,
      password: this.registerPassword,
      role: 'USER'
    }).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.storageService.setToken(res.token);
        this.storageService.setRefreshToken(res.refreshToken);
        await this.showToast('¡Cuenta creada! Bienvenido 🚀', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err?.error?.message || 'Error al crear la cuenta. ¿Ya existe ese email?';
        await this.showToast(msg, 'danger');
      }
    });
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({ message, duration: 2500, color, position: 'top' });
    await toast.present();
  }
}
