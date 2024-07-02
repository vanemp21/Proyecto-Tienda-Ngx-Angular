import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { PlantInterface } from '../models/product.model';
import { loadCart } from '../../../store/actions/actions';
import { AuthService } from './auth.service';
import { selectAllPlants } from '../../../store/selectors/selector';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  email$!: Observable<string>;
  email: string = '';
  plantCounterSubject = new BehaviorSubject<{ [plantId: string]: number }>({});
  plants$!: Observable<PlantInterface[]>;

  private cartItemsSubject = new BehaviorSubject<PlantInterface[]>([]);
  cartItems$: Observable<PlantInterface[]> =
    this.cartItemsSubject.asObservable();

  constructor(private store: Store, private authService: AuthService) {
    this.checkEmail();
    this.loadStateFromLocalStorage();
    this.syncStoreWithLocalStorage();
  }

  checkEmail() {
    this.email$ = this.authService.email.asObservable();
    this.email$.subscribe((email) => {
      this.email = email;
    });
  }

  addToCart(plant: PlantInterface) {
    let currentCartItems = this.cartItemsSubject.getValue();
    const existingIndex = currentCartItems.findIndex((p) => p.id === plant.id);
    if (existingIndex !== -1) {
      currentCartItems[existingIndex].counter++;
    } else {
      currentCartItems.push({ ...plant, counter: 1 });
    }
    this.cartItemsSubject.next(currentCartItems);
    this.updateLocalStorage(currentCartItems);
  }

  removeFromCart(id: number) {
    let currentCartItems = this.cartItemsSubject.getValue();
    const itemToRemove = currentCartItems.find((p) => p.id === id);
    if (itemToRemove) {
      if (itemToRemove.counter > 1) {
        itemToRemove.counter--;
      } else {
        currentCartItems = currentCartItems.filter((p) => p.id !== id);
      }
      this.cartItemsSubject.next(currentCartItems);
      this.updateLocalStorage(currentCartItems);
    }
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cartItems');
  }

  private updateLocalStorage(cartItems: PlantInterface[]) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  getCartItemsFromLocalStorage(): PlantInterface[] {
    const storedCartItems = localStorage.getItem('cartItems');
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  }

  loadStateFromLocalStorage() {
    const cartItems = this.getCartItemsFromLocalStorage();
    if (cartItems.length > 0) {
      this.store.dispatch(loadCart({ items: cartItems }));
    }
  }

  syncStoreWithLocalStorage() {
    this.store.select(selectAllPlants).subscribe((plants) => {
      this.updateLocalStorage(plants);
    });
  }

  async updatePlantCounter(plant: PlantInterface) {
    let currentCartItems = this.getCartItemsFromLocalStorage();
    const existingIndex = currentCartItems.findIndex((p) => p.id === plant.id);
    if (existingIndex !== -1) {
      if (plant.counter === 0) {
        currentCartItems = currentCartItems.filter((p) => p.id !== plant.id);
      } else {
        currentCartItems[existingIndex].counter = plant.counter;
      }
      this.cartItemsSubject.next(currentCartItems);
      this.updateLocalStorage(currentCartItems);
    }
  }

  async payDataCart(email: string) {
    this.clearCart();
  }

  async getDocData(): Promise<PlantInterface[] | undefined> {
    const storedCartItems = this.getCartItemsFromLocalStorage();
    return storedCartItems.length > 0 ? storedCartItems : undefined;
  }
}
