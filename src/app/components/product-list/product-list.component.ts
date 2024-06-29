import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PlantInterface } from '../../shared/models/product.model';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { addPlant, removePlant } from '../../../store/actions/actions';
import { PlantsService } from '../../shared/services/plants.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';

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
  userLogged$!: Observable<boolean>;
 
  
  constructor(
    private store: Store<{ plants: PlantInterface[] }>,
    private plantService: PlantsService,
    private toastr: ToastrService,
    private authService:AuthService
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

 
  getUserLogged(){
    if(this.authService.isLogged){
      console.log(this.authService.userLogged())
      return true
    }else{
      console.log(this.authService.userLogged())
      return false
    }

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
    this.userLogged$ = this.authService.isLogged.asObservable();
    // const items = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    // this.store.dispatch(loadCart({ items }));


  }

}
