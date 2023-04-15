import { BehaviorSubject, Observable } from 'rxjs';

export enum BehaviorStates {
  Empty,
  Loading,
  Ready,
  Error,
}

export class StateBehaviorSubject<T> extends BehaviorSubject<T> {
  private state: BehaviorSubject<BehaviorStates> =
    new BehaviorSubject<BehaviorStates>(BehaviorStates.Empty);

  asStateObservable(): StateObservable<T> {
    const observable: any = new StateObservable<T>(this.state.asObservable());
    observable.source = this;
    return observable;
  }

  empty() {
    this.state.next(BehaviorStates.Empty);
  }

  loading() {
    this.state.next(BehaviorStates.Loading);
  }

  override next(value: T): void {
    super.next(value);
    this.state.next(BehaviorStates.Ready);
  }

  override error(err: any): void {
    this.state.next(BehaviorStates.Error);
  }
}

export class StateObservable<T> extends Observable<T> {
  public state$!: Observable<BehaviorStates>;

  constructor(state: Observable<BehaviorStates>) {
    super();
    this.state$ = state;
  }
}
