import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };
  constructor(private httpClient:HttpClient) { }

  insertBill(data:any){
    return this.httpClient.post(`${this.url}/bill/insertBill`,data,{headers: {'Content-Type': 'application/json'}
    })
  }

  getBills(){
    return this.httpClient.get(`${this.url}/bill/getBills`)
  }

  delete(id:any){
    return this.httpClient.delete(`${this.url}/bill/delete/${id}`, this.jsonHeader);
  }

}
