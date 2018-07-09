import { Component, ElementRef, Input, Renderer, ViewChild } from '@angular/core';

@Component({
  selector: 'accordion-list',
  templateUrl: 'accordion-list.html'
})
export class AccordionListComponent {
  @Input() headerColor: string = '#F53D3D';
  @Input() textColor: string = '#FFF';
  @Input() contentColor: string = '#FFF';
  @Input() title: string;
  @Input() hasMargin: boolean = false;
  @Input() expanded: boolean;
  @Input() rightIcon: string = '';

  @ViewChild('accordionContent') elementView: ElementRef;

  viewHeight: number;

  constructor(public renderer: Renderer) { }

  ngAfterViewInit() {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;

    if (!this.expanded) {
      this.renderer.setElementStyle(this.elementView.nativeElement, 'height', 0 + 'px');
    }
    console.log("icon######",this.rightIcon);
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
    const newHeight = this.expanded ? '100%' : '0px';
    this.renderer.setElementStyle(this.elementView.nativeElement, 'height', newHeight);
  }

}
