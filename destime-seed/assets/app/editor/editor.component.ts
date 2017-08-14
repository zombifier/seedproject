import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
// import { AceEditorComponent } from "ng2-ace-editor";

// import { Message } from "./message.model";
import { EditorService } from "./editor.service";
declare var firebase: any;
declare var Firepad: any;

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./firepad.css'],
    styles: [`
        .author {
            display: inline-block;
            font-style: italic;
            font-size: 12px;
            width: 80%;
        }
        .config {
            display: inline-block;
            text-align: right;
            font-size: 12px;
            width: 19%;
        }
        #firepad {
            width: 700px;
            height: 450px;
        }
    `]
})

export class EditorComponent implements OnInit, AfterViewInit, AfterViewChecked {
    @ViewChild("editor") editor;

    name: string;
    firepadRef: any;
    firepad: any;
    

    constructor(private editorService: EditorService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.editor.setTheme("eclipse");
        console.log("view init");
        console.log("ace inited: " + this.hasInit);
    }

    onSubmit() {
        /*
        this.editorService.newOrOpenFile(this.name)
            .subscribe(
                data => {
                    console.log(data);
                }
                error => console.error(error)
            );

        // Get Firebase Database reference.
        */
        
        if (this.firepad) this.firepad.dispose();
        this.editor.setText();
        this.editor.getEditor().setValue("");
        this.firepadRef = firebase.database().ref("firepad/" + this.name);
        this.firepad = Firepad.fromACE(this.firepadRef, this.editor.getEditor());
    }
}
