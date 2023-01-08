import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export enum TwBreakpoints {
  sm,
  md,
  lg,
  xl,
  xxl,
}

@Component({
  selector: 'tw-breakpoints',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './tw-breakpoints.component.html',
})
export class TwBreakpointsComponent {
  @ViewChild('twBreakpointContainer', { static: true }) container!: ElementRef;
  @ViewChild('sm', { static: true }) sm!: ElementRef;
  @ViewChild('md', { static: true }) md!: ElementRef;
  @ViewChild('lg', { static: true }) lg!: ElementRef;
  @ViewChild('xl', { static: true }) xl!: ElementRef;
  @ViewChild('xxl', { static: true }) xxl!: ElementRef;

  @Output('breakpointChange') breakpointChange: EventEmitter<TwBreakpoints> =
    new EventEmitter<TwBreakpoints>();

  resizeObserver!: ResizeObserver;

  constructor() {}

  ngOnInit(): void {
    this.onResize();

    this.resizeObserver = new ResizeObserver((entries) => {
      this.debounce(() => {
        if (entries?.length > 0) this.onResize();
      });
    });
    this.resizeObserver.observe(this.container.nativeElement);
  }

  onResize() {
    if (this.offsetParentSet(this.sm)) {
      console.log('sm');
      this.breakpointChange.emit(TwBreakpoints.sm);
    }
    if (this.offsetParentSet(this.md)) {
      console.log('md');
      this.breakpointChange.emit(TwBreakpoints.md);
    }
    if (this.offsetParentSet(this.lg)) {
      console.log('lg');
      this.breakpointChange.emit(TwBreakpoints.lg);
    }
    if (this.offsetParentSet(this.xl)) {
      console.log('xl');
      this.breakpointChange.emit(TwBreakpoints.xl);
    }
    if (this.offsetParentSet(this.xxl)) {
      console.log('2xl');
      this.breakpointChange.emit(TwBreakpoints.xxl);
    }
  }

  offsetParentSet(el: ElementRef): boolean {
    return el.nativeElement.offsetParent != null;
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  debounceResizeTimeout: any = null;
  private debounce(fn: Function) {
    if (this.debounceResizeTimeout) {
      clearTimeout(this.debounceResizeTimeout);
    }
    this.debounceResizeTimeout = setTimeout(function () {
      fn();
    }, 150);
  }
}
