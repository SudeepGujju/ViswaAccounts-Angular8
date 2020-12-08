import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Permissions, User } from '../data-model';
import { userPermUrl, userUrl } from '../urlConfig';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private listUpdateSubject: Subject<boolean> = new Subject();
  public listUpdate$: Observable<boolean>;

  constructor(private http: HttpClient) { 
    this.listUpdate$ = this.listUpdateSubject.asObservable();
  }

  notifyToUpdateList(){
    this.listUpdateSubject.next(true);
  }

  getList(excludeLoggedInuser: boolean = false): Observable<User[]> {
    return this.http.get<User[]>(userUrl, {params: {excludeLoggedInuser: excludeLoggedInuser ? 'Y' : 'N'}});
  }

  get(id: string): Observable<User> {
    return this.http.get<User>(userUrl + '/' + id);
  }

  save(user: User): Observable<any> {
    return this.http.post(userUrl, user, {responseType: 'text'});
  }

  update(id: string, user: User): Observable<any> {
    return this.http.put(userUrl + '/' + id, user, {responseType: 'text'} );
  }

  delete(id: string) {
    return this.http.delete(userUrl + '/' + id, {responseType: 'text'});
  }

  getPersmission(id: string) {
    return this.http.get(userPermUrl + '/' + id);
  }

  updatePersmission(id: string, permissions: Permissions) {
    return this.http.post(userPermUrl + '/' + id, {permissions}, {responseType: 'text'});
  }

  // public updateUserPerm(id: string, permissions: Permissions){

  //   this.usersList = this.getList();

  //   const index = this.usersList.findIndex( x => x.id == id);

  //   if (index >= 0) {
  //     this.usersList[index].permissions = permissions;

  //     this.updateStorage(this.usersList);
  //   }

  //   return true;

  // }

  // private updateStorage(usersList: User[]) {
  //   this.authSrvc.usersList = usersList;
  // }


}
