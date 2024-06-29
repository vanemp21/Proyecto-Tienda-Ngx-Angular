import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { addPlant, removePlant, PayCart,loadCart } from  '../actions/actions'

@Injectable()
export class CartEffects {
  constructor(private actions$: Actions) {}

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCart),
      tap(() => {
        const items = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        return loadCart({ items });
      })
    )
  );

  saveCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPlant, PayCart),
      tap(action => {
        if (action.type === '[Plant List] Add Plant') {
          const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
          cart.push(action.plant);
          localStorage.setItem('shoppingCart', JSON.stringify(cart));
        } else if (action.type === '[Plant List] Pay Cart List') {
          localStorage.removeItem('shoppingCart');
        }
      })
    ),
    { dispatch: false }
  );
}
