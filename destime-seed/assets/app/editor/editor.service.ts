import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from "./user.model";
import { ErrorService } from "../errors/error.service";

declare var firebase: any;
declare var Firepad: any;
@Injectable()

export class EditorService {
    constructor(private http: Http, private errorService: ErrorService) {
        var config = {
            apiKey: "AIzaSyABCBP2MzvsVzqaZE89BImEadvjJiyNEv8",
            authDomain: "test-project-df431.firebaseapp.com",
            databaseURL: "https://test-project-df431.firebaseio.com",
            projectId: "test-project-df431",
            storageBucket: "test-project-df431.appspot.com",
            messagingSenderId: "284951005772"
        };
        firebase.initializeApp(config);
    }
    newOrOpenFile(fileName: String) {}

    saveFile(fileName: String) {}
}
