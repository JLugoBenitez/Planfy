import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Register está integrado en login.page como flip-card,
// esta página simplemente redirige al login con el flag de registro activado.
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-content>
      <div style="display:flex;align-items:center;justify-content:center;height:100vh">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
      </div>
    </ion-content>
  `
})
export class RegisterPage implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    // Redirige al login — el registro está integrado como flip-card en login
    this.router.navigate(['/login']);
  }
}
