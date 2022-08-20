import { Injectable } from '@angular/core';
import { User } from '../common/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthenticationService} from './authentication.service'

@Injectable({
  providedIn: 'root'
})
export abstract class RequestBaseService {

  protected currentUser : User = new User()

  protected constructor(protected authenticationService: AuthenticationService, protected httpClient: HttpClient) { 
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data
    } )
  }

  get getHeaders(): HttpHeaders{
    return new HttpHeaders({
      'Authorization': `Bearer `+ this.currentUser?.token,
      'Content-Type': 'application/json; charset=UTF-8',
    })
  }
}
