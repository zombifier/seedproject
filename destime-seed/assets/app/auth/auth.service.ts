import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from "./user.model";
import { ErrorService } from "../errors/error.service";

declare var FB;
declare var gapi;

@Injectable()
export class AuthService {
    constructor(private http: Http, private errorService: ErrorService) {
        /*
        FB.init({
            appId            : '478473549211549',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v2.10'
        });
        
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: '478522410885-hf7mscv37311pki0g9n1apb7fnhoo5el.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin'
            });

        });*/
    }

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/user', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/user/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    logout() {
        localStorage.clear();
        FB.logout();
        gapi.auth2.getAuthInstance().signOut();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

    authFacebook(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/user/signin/facebook', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    authGoogle(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/user/signin/google', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
}
