import { createAction, props } from '@ngrx/store';
import { PlantInterface } from '../../app/shared/models/product.model';

 
export const addPlant = createAction(
    '[Plant List] Add Plant',
    props<{ plant: PlantInterface }>()
  );
  
  export const removePlant = createAction(
    '[Plant List] Remove Plant',
    props<{ id: number }>()
  );
  
  export const removeById = createAction(
    '[Plant List] Remove By Id',
    props<{ id: number }>() 
  );
  export const PayCart = createAction('[Plant List] Pay Cart List')
