export class WindowViewModel {
  show = false;
}
export abstract class DataWindowViewModel extends WindowViewModel {
  abstract clear(): void;
}
