import { Injectable } from '@angular/core';
import { Product } from './../common/product';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest  } from '@angular/common/http';
import {AuthenticationService} from './authentication.service'
import {RequestBaseService} from './request-base.service'

@Injectable({
  providedIn: 'root'
})
export class WishlistService extends RequestBaseService {

  baseUrl = "http://localhost:8181/api/wish"

  constructor(authenticationService: AuthenticationService, httpClient: HttpClient,) { 
    super(authenticationService,httpClient )
  }

  getWishList():Observable<Product[]>{
    return this.httpClient.get<Product[]>("http://localhost:8181/api/wish/wishlist", { headers: this.getHeaders })
  }

   storageUserAsStr: any = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null
   

  addToWishList(id: number):Observable<any>{
    
    return this.httpClient.post<any>('http://localhost:8181/api/wish/wishlist/'+id,{}, { headers: this.getHeaders });
    
  }

  deleteWishList(id: number):Observable<any>{
    return this.httpClient.delete<any>("http://localhost:8181/api/wish/wishlist/"+id,{ headers: this.getHeaders })
  }
}
