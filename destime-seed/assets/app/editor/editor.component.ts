import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
// import { AceEditorComponent } from "ng2-ace-editor";

// import { Message } from "./message.model";
import { EditorService } from "./editor.service";
declare var firebase: any;
declare var Firepad: any;
declare var ace;

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./firepad.css', './editor.css'],
})

export class EditorComponent implements OnInit, AfterViewInit {
    name: string;
    projectName: string
    firepadRef: any;
    firepad: any;
    editor: any;
    

    constructor(private editorService: EditorService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.editor = ace.edit('firepad');
    }

    openFile() {
        // tell the server that this file exists
        this.editorService.newOrOpenFile(this.name)
            .subscribe(
                data => {
                    console.log(data);
                },
                error => console.error(error);
            );


        // Get Firebase Database reference.
        if (this.firepad) this.firepad.dispose();
        this.editor.setValue("");
        this.firepadRef = firebase.database().ref("firepad/" + localStorage.projectId + "/" + this.name);
        this.firepad = Firepad.fromACE(this.firepadRef, this.editor);
    }

    openProject() {
        this.editorService.newOrOpenProject(this.projectName)
            .subscribe(
                data => {
                    localStorage.setItem('projectId', data.obj._id);
                },
                error => console.error(error);
            );
    }
    launchProject() {
        this.editorService.launchProject(this.projectName)
            .subscribe(
                data => {
                    console.log(data);
                },
                error => console.error(error);
            );
    }
}
