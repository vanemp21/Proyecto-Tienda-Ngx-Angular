/*
product-list.ts

import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { PlantInterface } from '../../shared/models/product.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  addPlant,
  loadPlantsSuccess,
  removePlant,
} from '../../../store/actions/actions';
import { selectAllPlants } from '../../../store/selectors/selectors';
import { AppState } from '../../../store';
import { PlantsService } from '../../shared/services/plants.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  plants$: Observable<PlantInterface[]>;
 
  constructor(private stores: Store<AppState>, private plantService:PlantsService) {
    this.plants$ = this.stores.select(selectAllPlants);
    this.plantService.getPlants().subscribe((plants: PlantInterface[]) => {
      this.stores.dispatch(loadPlantsSuccess({ plants }));
    });  }

  addPlant(plant: PlantInterface) {
    this.stores.dispatch(addPlant({ plant }));
  }
  onRemovePlant(id: number) {
    this.stores.dispatch(removePlant({ id }));
  }
}
  select.ts
  import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlantInterface } from '../../app/shared/models/product.model';

// createFeatureSelector para seleccionar el slice 'plants' del estado global
export const selectPlantsFeature = createFeatureSelector<PlantInterface[]>('plants');

// createSelector para crear un selector que simplemente devuelve el estado de las plantas seleccionado
export const selectAllPlants = createSelector(
  selectPlantsFeature,
  (plants: PlantInterface[]) => plants // Devuelve directamente el array de plantas
);



*/