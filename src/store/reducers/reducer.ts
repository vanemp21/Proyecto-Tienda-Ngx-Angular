import { createReducer, on, Action } from '@ngrx/store';
import { PlantInterface } from '../../app/shared/models/product.model';
import { PayCart, addPlant, loadCart, removeById, removePlant } from '../actions/actions';

export const initialState: PlantInterface[] = [];
const _plantReducer = createReducer(
  initialState,
  on(addPlant, (state, { plant }) => {
    const existingPlant = state.find((p) => p.id === plant.id);
    if (existingPlant) {
      return state.map((p) =>
        p.id === plant.id ? { ...p, counter: p.counter + 1 } : p
      );
    } else {
      return [...state, { ...plant, counter: 1 }];
    }
  }),

  on(removePlant, (state, { id }) => {
    return state.reduce((newState: PlantInterface[], plant) => {
      if (plant.id === id) {
        const newCounter = plant.counter - 1;
        if (newCounter > 0) {
          newState.push({ ...plant, counter: newCounter });
        }
      } else {
        newState.push(plant);
      }
      return newState;
    }, []);
  }),

  on(removeById, (state, { id }) => {
    return state.filter(plant => plant.id !== id);
  }),
  on(PayCart, (state) => {
    return [];
  }),

  on(loadCart, (state, { items }) => items)
);

export function plantReducer(
  state: PlantInterface[] | undefined,
  action: Action
) {
  return _plantReducer(state, action);
}
