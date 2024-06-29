import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Register } from '../../../shared/models/register.model';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formulario: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.formulario = this.fb.group(
      {
        nombre: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repetirPass: ['', [Validators.required]],
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')!.value;
    const confirmPass = group.get('repetirPass')!.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  async onSubmit() {
    const registrarUsuario: Register = {
      name: this.formulario.value.nombre,
      email: this.formulario.value.correo,
      password: this.formulario.value.password,
    };
    if (this.formulario.valid) {
      console.log(name, registrarUsuario.email, registrarUsuario.password);
      try {
        const user = await this.authService.signUp(
          registrarUsuario.email,
          registrarUsuario.password
        );
        console.log('User signed up:', user);
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  }

  async onSubmitGoogle() {
    try {
      const user = await this.authService.signUpGoogle();
      const isLogged = this.authService.isLogged
      if (isLogged) {
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

//    this.router.navigate(['/']);