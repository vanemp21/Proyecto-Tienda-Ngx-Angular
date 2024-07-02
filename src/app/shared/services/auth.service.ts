import { Injectable } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogged = new BehaviorSubject<boolean>(false);
  email = new BehaviorSubject<string>('');

  constructor(private auth: Auth, private toastr: ToastrService) {
    const isUserLogged = localStorage.getItem('isLogged');
    const userEmail = localStorage.getItem('userEmail');
    if (isUserLogged && userEmail) {
      this.isLogged.next(true);
      this.email.next(userEmail);
    }
  }

  async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      this.handleSuccessfulLogin(user.email!);
      return user;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  async signUpGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      this.handleSuccessfulLogin(user.email!);
      return user;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.handleSuccessfulLogin(email);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  signOut() {
    this.isLogged.next(false);
    localStorage.removeItem('isLogged');
    localStorage.removeItem('userEmail');
    this.toastr.success('Has cerrado sesión', 'Sesión cerrada');
    return signOut(this.auth);
  }

  private handleSuccessfulLogin(email: string) {
    this.isLogged.next(true);
    localStorage.setItem('isLogged', 'true');
    localStorage.setItem('userEmail', email);
    this.email.next(email);
    this.toastr.success(`¡Hola de nuevo ${email}!`, 'Bienvenido');
  }

  private handleAuthError(error: any) {
    let errorMessage = 'Ha ocurrido un error';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = `El correo ${error.email} ya está en uso.`;
        break;
      case 'auth/invalid-email':
        errorMessage = `El correo ${error.email} es inválido.`;
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Error durante el inicio de sesión.';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña no es suficientemente segura.';
        break;
      default:
        errorMessage = error.message;
        break;
    }
    this.toastr.error(errorMessage, 'Error');
  }
  userLogged() {
    return this.isLogged.value;
  }
}
