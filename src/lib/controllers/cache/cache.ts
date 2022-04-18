export class BaseCache {
  /** The name of the cache */
  protected name: string;
  public activeCacheManagers: string[];

  public constructor(name: string) {
    this.name = name;
    this.activeCacheManagers = [];
  }
}
