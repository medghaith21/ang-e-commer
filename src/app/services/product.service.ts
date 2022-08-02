import { Product } from './../common/product';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  FormGroup, }
  from '@angular/forms';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   baseUrl = "http://localhost:8181/product"
  product : Product = new Product()

  public dataForm!: FormGroup;

  constructor(private httpClient: HttpClient) { }

  getProductList():Observable<Product[]>{
    return this.httpClient.get<Product[]>(this.baseUrl+"/products")
  }
  getProductById(id:number):Observable<Product>{
    return this.httpClient.get<Product>(`${this.baseUrl}/find/`+id)
  }

  addTask(formData: FormData): Observable<any> {
    return this.httpClient.post(this.baseUrl+"/addproduct", formData);
  }

  updateTask(formData: FormData): Observable<any> {
    return this.httpClient.post(this.baseUrl+"/update", formData);
  }


  // uploadFile(file: File): Observable<HttpEvent<{}>> {
  //   const formdata: FormData = new FormData();
  //   formdata.append('file', file);
  //   const req = new HttpRequest('POST', '<Server URL of the file upload>', formdata, {
  //     reportProgress: true,
  //     responseType: 'text'
  //   });

  //   return this.httpClient.request(req);
  // }

  deleteProduct(product: Product): Observable<Product> {
    const url = `${this.baseUrl}/delete/${product.id}`;
    return this.httpClient.delete<Product>(url);
  }

   post_options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
  }


  getImagesByProducts(id:number):Observable<any[]>{
    return this.httpClient.get<any[]>(this.baseUrl+"/images/"+id)
  }


  

}
