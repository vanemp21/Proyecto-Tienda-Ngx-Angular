import { Injectable } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogged = new BehaviorSubject<boolean>(false);
  email = new BehaviorSubject<string>('') 
  constructor(private auth: Auth, private toastr: ToastrService) {}
  async signUp(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        this.toastr.success('Te has registrado correctamente', 'Bienvenido');
        this.isLogged.next(true)
        localStorage.setItem('isLogged', 'true');
        this.email.next(email)
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        let errormessage = '';
        switch (error.code) {
          case 'auth/email-already-in-use':
            errormessage = `El correo ${email} ya está en uso.`;
            break;
          case 'auth/invalid-email':
            errormessage = `El correo ${email} es inválido.`;
            break;
          case 'auth/operation-not-allowed':
            errormessage = 'Error durante el inicio de sesión.';
            break;
          case 'auth/weak-password':
            errormessage = 'La contraseña no es suficientemente segura.';
            break;
          default:
            errormessage = error.message;
            break;
        }
        this.toastr.error(errormessage, 'Error');
        return errorCode;
      });
  }
  async signUpGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      this.isLogged.next(true)
      localStorage.setItem('isLogged', 'true');
      this.toastr.success(`Bienvenido ${user.email}`, 'Inicio de sesión completado');
      this.email.next(user.email!)
      return user;
    } catch (error) {
      this.toastr.error('Ha ocurrido un error', 'Error');
      throw error;
    }
  }
  signIn(email: string, password: string) {
    this.isLogged.next(true)
    localStorage.setItem('isLogged', 'true');
    this.email.next(email)
    this.toastr.success(`¡Hola de nuevo  ${email} !`, 'Bienvenido');
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  signOut() {
    this.isLogged.next(false)
    localStorage.removeItem('isLogged');
    this.toastr.success('Has cerrado sesión','Sesión cerrada')
    return signOut(this.auth);
  }
  userLogged(){
    return this.isLogged.value
  }
}
