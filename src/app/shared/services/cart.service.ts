import { Injectable } from '@angular/core';
import { Firestore, deleteDoc, getDoc, setDoc } from '@angular/fire/firestore';
import {
  doc,
  where,
  getDocs,
  collection,
  query,
  updateDoc,
} from 'firebase/firestore';
import { BehaviorSubject, Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { PlantInterface } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  email$!: Observable<string>;
  email: string = '';
  plantCounterSubject = new BehaviorSubject<{ [plantId: string]: number }>({});
  plants$: Observable<PlantInterface[]>;
  plantCounters$: Observable<{ [plantId: string]: number }>;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private store: Store<{ plants: PlantInterface[] }>
  ) {
    this.plantCounters$ = this.plantCounter$;
    this.plantCounters$.subscribe((counters) => {});
    this.plants$ = this.store.select('plants');
    this.checkEmail();
  }
  getDataCart() {}
  checkEmail() {
    this.email$ = this.authService.email.asObservable();
    this.email$.subscribe((email) => {
      this.email = email;
    });
  }
  async addDataCart2() {
    this.plants$.subscribe(async (elemento) => {
      if (elemento && elemento.length > 0) {
        const planta = elemento;
        const cartData = collection(this.firestore, 'cartlist');
        const q = query(cartData, where('email', '==', this.email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot) {
          const docRef = doc(this.firestore, `cartlist/${this.email}`);
          await setDoc(docRef, { planta }, { merge: true });
        }
      } else {
        await this.removePlantCart();
      }
    });
  }

  get plantCounter$(): Observable<{ [plantId: string]: number }> {
    return this.plantCounterSubject.asObservable();
  }

  async updatePlantCounter(plant: PlantInterface) {
    const cartData = collection(this.firestore, 'cartlist');
    const q = query(
      cartData,
      where('email', '==', this.email),
      where('plant.id', '==', plant.id)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (document) => {
        const docRef = doc(this.firestore, `cartlist/${document.id}`);
        if (plant.counter === 0) {
          await this.removePlantCart();
        } else {
          await updateDoc(docRef, {
            'plant.counter': plant.counter,
          });
        }
      });
    }
  }

  async addDataCart() {
    this.plants$.subscribe(async (elemento) => {
      if (elemento && elemento.length > 0) {
        const planta = elemento;
        const docRef = doc(this.firestore, `cartlist/${this.email}`);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          await setDoc(docRef, { planta }, { merge: true });
        } else {
          await setDoc(docRef, { email: this.email, planta });
        }
      } else {
        await this.removePlantCart();
      }
    });
  }
  async removePlantCart() {
    const docRef = doc(this.firestore, `cartlist/${this.email}`);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      await deleteDoc(docRef);
    }
  }

  async getDocData() {
    const docRef = doc(this.firestore, 'cartlist', this.email);
    try {
      const doc = await getDoc(docRef);
      if (doc.exists()) {
        console.log(doc.data());
      }
    } catch (err) {
      console.log(err);
    }
  }
  async payDataCart(email: string) {
    const docRef = doc(this.firestore, `cartlist/${email}`);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      await deleteDoc(docRef);
      console.log(`El carrito de ${email} ha sido vaciado.`);
    } else {
      console.log(`No se encontró un carrito para ${email}.`);
    }
  }
}
