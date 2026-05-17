import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonSpinner, ToastController, LoadingController } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService, JwtAuthResponse } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  loginEmail = '';
  loginPassword = '';
  registerNombre = '';
  registerEmail = '';
  registerPassword = '';
  showRegister = false;
  submitting = false;

  private auth = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private destroyRef = inject(DestroyRef);

  goToRegister() { this.showRegister = true; }
  goToLogin() { this.showRegister = false; }

  async login() {
    if (this.submitting) return;
    const email = this.loginEmail.trim();
    const password = this.loginPassword;

    if (!email || !password) return this.showToast('Rellena todos los campos', 'warning', '⚠️');
    if (!EMAIL_REGEX.test(email)) return this.showToast('Email no válido', 'warning', '⚠️');

    this.submitting = true;
    const loading = await this.loadingController.create({ message: 'Entrando...', spinner: 'crescent' });
    await loading.present();

    this.auth.login({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async (_res: JwtAuthResponse) => {
          await loading.dismiss();
          this.submitting = false;
          await this.showToast('¡Bienvenido de vuelta!', 'success', '👋');
          this.router.navigate(['/dashboard']);
        },
        error: async (err: HttpErrorResponse) => {
          await loading.dismiss();
          this.submitting = false;
          await this.showToast(this.friendlyError(err, 'Email o contraseña incorrectos'), 'danger', '❌');
        }
      });
  }

  async register() {
    if (this.submitting) return;
    const nombre = this.registerNombre.trim();
    const email = this.registerEmail.trim();
    const password = this.registerPassword;

    if (!nombre || !email || !password) return this.showToast('Rellena todos los campos', 'warning', '⚠️');
    if (!EMAIL_REGEX.test(email)) return this.showToast('Email no válido', 'warning', '⚠️');
    if (password.length < MIN_PASSWORD) return this.showToast(`Contraseña mínima: ${MIN_PASSWORD} caracteres`, 'warning', '⚠️');

    this.submitting = true;
    const loading = await this.loadingController.create({ message: 'Creando cuenta...', spinner: 'crescent' });
    await loading.present();

    this.auth.register({ nombre, email, password, role: 'USER' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async (_res: JwtAuthResponse) => {
          await loading.dismiss();
          this.submitting = false;
          await this.showToast('¡Cuenta creada con éxito!', 'success', '🚀');
          this.router.navigate(['/dashboard']);
        },
        error: async (err: HttpErrorResponse) => {
          await loading.dismiss();
          this.submitting = false;
          await this.showToast(this.friendlyError(err, 'Error al crear la cuenta'), 'danger', '❌');
        }
      });
  }

  private friendlyError(err: HttpErrorResponse, fallback: string): string {
    if (err?.status === 0) return 'Sin conexión con el servidor';
    if (err?.status === 409) return 'Ese email ya está registrado';
    const msg = (err?.error && typeof err.error === 'object') ? (err.error as { message?: string }).message : undefined;
    return msg || fallback;
  }

  private async showToast(message: string, color: string, icon: string): Promise<void> {
    const toast = await this.toastController.create({
      message: `${icon} ${message}`,
      duration: 3000,
      color,
      position: 'bottom',
      cssClass: 'planfy-toast',
      buttons: [{ icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }
}
