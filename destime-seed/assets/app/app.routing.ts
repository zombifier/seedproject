import { Routes, RouterModule } from "@angular/router";

import { MessagesComponent } from "./messages/messages.component";
import { AuthenticationComponent } from "./auth/authentication.component";
import { EditorComponent } from "./editor/editor.component";
import { TokenComponent } from "./auth/token.component";
import { AUTH_ROUTES } from "./auth/auth.routes";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/messages', pathMatch: 'full' },
    { path: 'messages', component: MessagesComponent },
    { path: 'auth', component: AuthenticationComponent, children: AUTH_ROUTES },
    { path: 'editor', component: EditorComponent },
    { path: 'token', component: TokenComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
