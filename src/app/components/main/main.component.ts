import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FormulaModelComponent } from "../formula-model/formula-model.component";
import { timeInterval } from "rxjs";
import { MathQuillService } from "src/app/services/mathquill.service";

declare let MathJax: any;


@Component({
  selector: 'main-component',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild("render") qqq: ElementRef;
  //@ViewChild("math-field") mathFieldSpan: ElementRef;
  
  text: string = "$$ px^2 + qx + r = 0 $$";
  lines: string[] = [];
  mathField: any;

  selectionFlag: boolean = false;
  clearFlag: boolean = false;
  
  constructor(private dialog: MatDialog, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
  }
  
  openAddFunction() {
    var formulaDialog = this.dialog.open(FormulaModelComponent);
    formulaDialog.afterClosed().subscribe(resp => {
      if(!resp || resp.formula == '$$') return;
      this.lines.push(resp.formula);
      this.cdRef.detectChanges();
      MathJax.typeset([document.getElementById((this.lines.length-1).toString())]);
      MathJax.typeset([document.getElementById("test")]);
    });
  }

  clear() {
    this.lines = [];
    this.cdRef.detectChanges();
  }

  selection(text: any) {
    if((!this.selectionFlag && !this.clearFlag) || (this.selectionFlag && this.clearFlag)) return;

    if(this.selectionFlag) {
      if(text.srcElement.localName != "mjx-math" && text.srcElement.localName != "div")
        text.srcElement.style.backgroundColor = "#bcf3fa"; 
    }
    else {
      text.srcElement.style.backgroundColor = "";
    }
  }

  clickSelection(text: any) {
    if(text.type == 'mousedown') {
      if(text.which == 1) {
        this.selectionFlag = true;
        if(text.srcElement.localName != "mjx-math" && text.srcElement.localName != "div")
          text.srcElement.style.backgroundColor = "#bcf3fa"; 
      }
      else { // must be which = 3 (rightClick)
        this.clearFlag = true;
        text.srcElement.style.backgroundColor = "";
      }
    }
    else {
      if(text.which == 1)
        this.selectionFlag = false;
      else // must be which = 3 (rightClick)
        this.clearFlag = false;
    }
  }
}