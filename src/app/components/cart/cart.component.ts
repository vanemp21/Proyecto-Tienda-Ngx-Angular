import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlantInterface } from '../../shared/models/product.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {
  addPlant,
  PayCart,
  removeById,
  removePlant,
} from '../../../store/actions/actions';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit{
  @Output() closeCartEvent = new EventEmitter<boolean>();
  totalByPlant: { [id: number]: number } = {};
  plants$: Observable<PlantInterface[]>;
  total: number = 0;
  counterSubject = new BehaviorSubject<number>(0);
  counter: any;
  plantCounters$: Observable<{ [plantId: string]: number }>;

  constructor(
    private store: Store<{ plants: PlantInterface[] }>,
    private toastr: ToastrService,
    private cartService:CartService
  ) {
    this.plants$ = this.store.select('plants');
    this.calculateTotal();
    this.calculateByIndex();
    this.plantCounters$ = this.cartService.plantCounter$;

  }
  calculateByIndex() {
    this.plants$.subscribe((plants) => {
      this.totalByPlant = {};
      plants.forEach((plant) => {
        this.totalByPlant[plant.id] = plant.counter * plant.price;
      });
    });
  }

  calculateTotal() {
    this.plants$.subscribe((plants) => {
      this.total = plants.reduce((acc, plant) => {
        if (plant.counter > 1) {
          return acc + plant.price * plant.counter;
        } else {
          return acc + plant.price;
        }
      }, 0);
    });
  }
  onAddPlant(plant: PlantInterface) {
    this.store.dispatch(addPlant({ plant })); 
    this.cartService.updatePlantCounter(plant);
  }
  onRemovePlant(id: number) {
    this.store.dispatch(removePlant({ id }));
  }
  onRemoveById(id: number) {
    this.store.dispatch(removeById({ id }));
    this.toastr.info(
      'Has eliminado el producto al carrito correctamente',
      'Producto eliminado'
    );
  }
  onPayPlants() {
    this.store.dispatch(PayCart());
    this.toastr.success(
      '¡Productos comprados correctamente!',
      'Productos Pagados'
    );
    this.cartService.payDataCart(this.cartService.email)
  }
  closeCart(): void {
    this.closeCartEvent.emit(false);
  }

  ngOnInit(): void {
    this.plantCounters$.subscribe(counters => {
      this.counter = counters
    });
  }
}
