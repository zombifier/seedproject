import { Component } from '@angular/core';

import { MessageService } from "./messages/message.service";
import { EditorService } from "./editor/editor.service";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [MessageService, EditorService]
})
export class AppComponent {
}
