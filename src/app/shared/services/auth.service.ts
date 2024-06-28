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
  constructor(private auth: Auth, private toastr: ToastrService) {}
  //Registro
  async signUp(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user)
          .then(() => {
            this.toastr.success(
              `Se ha enviado un correo de verificación a ${user.email}`,
              'Registro completado'
            );
          })
          .catch(() => {
            this.toastr.error('Error al enviar el mensaje', 'Error');
          });
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
  signUpGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    auth.languageCode = 'es';
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        this.toastr.success(`Bienvenido ${user.email}`, 'Registro completado');
      })
      .catch((error) => {
        const credential = GoogleAuthProvider.credentialFromError(error);
        this.toastr.error(error.message)
      });
  }
  //Logeo
  signIn(email: string, password: string) {
    this.toastr.success(`¡Hola de nuevo  ${email} !`, 'Bienvenido');
    return signInWithEmailAndPassword(this.auth, email, password);
  }
 
  //Deslogeo
  signOut() {
    return signOut(this.auth);
  }
}
