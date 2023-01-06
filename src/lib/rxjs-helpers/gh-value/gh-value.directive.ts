import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { isObservable, Observable } from 'rxjs';

class Context<T> {
  $implicit!: T;

  constructor(value: T) {
    this.$implicit = value;
  }
}

@Directive({
  selector: '[ghValue]',
  standalone: true,
})
export class GhValueDirective<T> implements OnInit {
  @Input('ghValue') val!: T | Observable<T>;
  _val!: T;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    if (isObservable(this.val)) {
      this.val.subscribe((val) => (this._val = val));
    } else {
      this._val = this.val;
    }

    this.viewContainer.createEmbeddedView(
      this.templateRef,
      new Context(this._val)
    );
  }

  // Guard to help Typescript correctly type checked
  // the context with which the template will be rendered
  static ngTemplateContextGuard<T>(
    directive: GhValueDirective<T>,
    context: unknown
  ): context is Context<T> {
    return true;
  }
}
