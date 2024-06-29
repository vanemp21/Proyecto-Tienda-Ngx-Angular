import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlantInterface } from '../models/product.model';

import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../../components/cart/cart.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CartComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  showCart: boolean = false;

  plants$: Observable<PlantInterface[]>;
  userLogged= new BehaviorSubject<boolean>(false);
  constructor(
    private store: Store<{ plants: PlantInterface[] }>,
    private authService: AuthService
    
  ) {
    this.plants$ = this.store.select('plants');
    this.isLogged()
  }
  toggleCartVisibility() {
    this.showCart = !this.showCart;
  }
  onCloseCart(event: boolean) {
    this.showCart = event;
  }
  isLogged() {
    this.userLogged = this.authService.isLogged
  }
}
