import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlantInterface } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PlantsService {
  private jsonUrl = 'assets/data.json';

  constructor(private http: HttpClient) { }
  getPlants(): Observable<PlantInterface[]> {
    return this.http.get<PlantInterface[]>(this.jsonUrl);
  }
}
