import { Injectable } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import {
  sendEmailVerification,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogged = false;
  constructor(private auth: Auth, private toastr: ToastrService) {}
  //Registro
  async signUp(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        this.toastr.success('Te has registrado correctamente', 'Bienvenido');
        this.isLogged = true;
        console.log(this.isLogged);
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
      this.isLogged = true;
      this.toastr.success(`Bienvenido ${user.email}`, 'Registro completado');
      return user;
    } catch (error) {
      this.toastr.error('Ha ocurrido un error', 'Error');
      throw error;
    }
  }

  //Logeo
  signIn(email: string, password: string) {
    this.isLogged = true;
    this.toastr.success(`¡Hola de nuevo  ${email} !`, 'Bienvenido');
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  //Deslogeo
  signOut() {
    return signOut(this.auth);
  }

  getLogged() {
    return this.isLogged;
  }
}
