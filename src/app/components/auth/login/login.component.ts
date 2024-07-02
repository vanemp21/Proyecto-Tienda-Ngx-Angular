import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})
export class LoginComponent implements OnInit {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Al inicializar el componente, intenta recuperar los datos del formulario desde localStorage
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.formulario.patchValue({ correo: savedEmail });
    }
  }

  async onSubmit() {
    if (this.formulario.valid) {
      const email = this.formulario.value.correo;
      const password = this.formulario.value.password;
      
      // Guardar el email en localStorage para mantenerlo después de actualizar la página
      localStorage.setItem('savedEmail', email);

      try {
        const user = await this.authService.signIn(email, password);
        this.router.navigate(['/']);  
      } catch (error) {
        console.error('Error signing in:', error);
      }
    } else {
      console.log('Formulario inválido');
    }
  }

  async onSubmitGoogle() {
    try {
      await this.authService.signUpGoogle();
      const isLogged = this.authService.isLogged.getValue(); 
      if (isLogged) {
        this.router.navigate(['/']);  
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  }
}
