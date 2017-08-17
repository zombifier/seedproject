import {Router, ActivatedRoute, Params} from '@angular/router';
import {OnInit, Component} from '@angular/core';

@Component({
    selector: 'app-token',
    template: `
    <h1>Automatically redirecting...</h1>
    `
})
export class TokenComponent implements OnInit {

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            console.log(params);
            var token = params['token'];
            var userId = params['userId'];
            console.log(token + " and " + userId);
            if (token && userId) {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
            }
            this.router.navigateByUrl('/');
        });

    });
}

}
