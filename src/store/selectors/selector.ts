import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlantInterface } from '../../app/shared/models/product.model';

export const selectPlantsState = createFeatureSelector<PlantInterface[]>('plants');

export const selectAllPlants = createSelector(
  selectPlantsState,
  (state: PlantInterface[]) => state
);
