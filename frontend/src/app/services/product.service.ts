import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };
  constructor(private httpClient: HttpClient) { }

  getProducts() {
    return this.httpClient.get(`${this.url}/product/get/`)
  }

  add(data: any) {
    return this.httpClient.post(`${this.url}/product/add`, data, this.jsonHeader);
  }
  update(data: any) {
    return this.httpClient.patch(`${this.url}/product/update`, data, this.jsonHeader);
  }

  updateStatus(data: any) {
    return this.httpClient.patch(`${this.url}/product/updateStatus`, data, this.jsonHeader);
  }

  delete(id: any) {
    return this.httpClient.delete(`${this.url}/product/delete/${id}`, this.jsonHeader);
  }

  getProductsByCategory(id: any) {
    return this.httpClient.get(`${this.url}/product/getByCategory/${id}`);
  }

  getById(id: any) {
    return this.httpClient.get(`${this.url}/product/getById/${id}`);
  }

}
