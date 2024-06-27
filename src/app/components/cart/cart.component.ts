import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlantInterface } from '../../shared/models/product.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {
  addPlant,
  PayCart,
  removeById,
  removePlant,
} from '../../../store/actions/actions';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  @Output() closeCartEvent = new EventEmitter<boolean>();
porplanta:number=0
totalByPlant: { [id: number]: number } = {};
  plants$: Observable<PlantInterface[]>;
  total: number = 0;
  constructor(private store: Store<{ plants: PlantInterface[] }>,    private toastr: ToastrService) {
    this.plants$ = this.store.select('plants');
    this.calculateTotal();
    this.calculateByIndex();
  }
  calculateByIndex() {
    this.plants$.subscribe(plants => {
     this.totalByPlant = {};
      plants.forEach(plant => {
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

  }
  onRemovePlant(id: number) {
    this.store.dispatch(removePlant({ id }));

  }
  onRemoveById(id: number) {
    this.store.dispatch(removeById({ id }));
    this.toastr.info('Has eliminado el producto al carrito correctamente', 'Producto eliminado');

  }
  onPayPlants(){
    this.store.dispatch(PayCart())
    this.toastr.success('¡Productos comprados correctamente!', 'Productos Pagados');
  }
  closeCart() {
    this.closeCartEvent.emit(false);
  }


}
