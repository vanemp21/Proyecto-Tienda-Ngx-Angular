import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PlantInterface } from '../../shared/models/product.model';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { addPlant, removePlant } from '../../../store/actions/actions';
import { PlantsService } from '../../shared/services/plants.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  plants: PlantInterface[] = [];
  plants$: Observable<PlantInterface[]>;
  productoSub: Subscription | undefined;
  constructor(
    private store: Store<{ plants: PlantInterface[] }>,
    private plantService: PlantsService,
    private toastr: ToastrService
  ) {
    this.plants$ = this.store.select('plants');
  }
  addPlant(plant: PlantInterface) {
    this.store.dispatch(addPlant({ plant }));
    this.toastr.success('Has añadido el producto al carrito correctamente', 'Producto añadido');

  }
  onRemovePlant(id: number) {
    this.store.dispatch(removePlant({ id }));
  }

 
  ngOnInit(): void {
    this.productoSub = this.plantService.getPlants().subscribe({
      next: (plants: PlantInterface[]) => {
        this.plants = plants;
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {},
    });
  }
}
