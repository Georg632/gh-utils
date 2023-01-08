import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { isObservable, Observable } from 'rxjs';

class GhValueContext<T> {
  $implicit!: T;
}

@Directive({
  selector: '[ghValue]',
  standalone: true,
})
export class GhValueDirective<T> implements OnInit {
  @Input('ghValue') val!: T | Observable<T>;
  context: GhValueContext<T> = new GhValueContext<T>();

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isObservable(this.val)) {
      this.val.subscribe((val) => {
        console.log(val);
        this.context.$implicit = val;
        this.changeDetectorRef.markForCheck();
      });
    } else {
      this.context.$implicit = this.val;
    }

    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  // Guard to help Typescript correctly type checked
  // the context with which the template will be rendered
  static ngTemplateContextGuard<T>(
    directive: GhValueDirective<T>,
    context: unknown
  ): context is GhValueContext<T> {
    return true;
  }
}
