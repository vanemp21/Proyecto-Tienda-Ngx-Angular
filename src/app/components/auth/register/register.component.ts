import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Register } from '../../../shared/models/register.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  formulario: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) {
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

  onSubmitGoogle() {
    try {
      const user = this.authService.signUpGoogle();
      console.log('Iniciado sesión con ' + user);
    } catch (error) {
      console.log(error);
    }
  }
}
// onLogout() {
//   this.authService.signOut()
//     .then(() => {
//       console.log('User logged out');
//     })
//     .catch(error => {
//       console.error('Error logging out:', error);
//     });
// }



//    this.router.navigate(['/']);