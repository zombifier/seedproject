import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { User } from "./user.model";
import { AuthService } from "./auth.service";

declare var FB;
declare var gapi;

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent {
    myForm: FormGroup;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        const user = new User(this.myForm.value.email, this.myForm.value.password);
        this.authService.signin(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    this.router.navigateByUrl('/');
                },
                error => console.error(error)
            );
        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }

    signInFacebook() {
        FB.login(response => {
            if (response.status === "connected") {
                var accessToken = response.authResponse.accessToken;
                FB.api('/me', {fields: 'first_name, last_name, email'}, response => {
                    console.log(response);
                    const user = new User(response.email, undefined, response.first_name, response.last_name, response.id, accessToken);
                    this.authService.authFacebook(user)
                        .subscribe(
                            data => {
                                localStorage.setItem('token', data.token);
                                localStorage.setItem('userId', data.userId);
                                this.router.navigateByUrl('/');
                            },
                            error => console.error(error)
                        );
                });
            }
        } ,{scope: 'public_profile,email'});
    }

    signInGoogle() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signIn().then(response => {
            console.log(response);
            if (response.error) {
                return Observable.throw(response.error.json());
            }
            var googleProfile = auth2.currentUser.get().getBasicProfile();
            const user = new User(googleProfile.getEmail(), undefined, googleProfile.getGivenName(), googleProfile.getFamilyName(), undefined, undefined, googleProfile.getId(), auth2.currentUser.get().getAuthResponse().id_token);
            this.authService.authGoogle(user)
                .subscribe(
                    data => {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('userId', data.userId);
                        this.router.navigateByUrl('/');
                    },
                    error => console.error(error)
                );
        });
    }
}
