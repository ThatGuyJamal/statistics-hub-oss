export default class DestructObject {
  public constructor(message = {}) {
    this.destructObject(message);
  }
  public destructObject(message: { [s: string]: unknown } | ArrayLike<unknown>) {
    for (let [key, value] of Object.entries(message)) {
      //@ts-ignore
      this[key] = value;
    }
    return this;
  }

  public toJSON() {
    return { ...this };
  }
}
