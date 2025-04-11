/** @format */

// Observer Interface
interface IObserver<T> {
  update(data: T): void;
}

export default class Observer<T> implements IObserver<T> {
  public update: (data: T) => void;

  constructor(updateFn: (data: T) => void) {
    this.update = updateFn;
  }
}
