import { container, LogLevel } from "@sapphire/framework";

/**
 * A Wrapper around sapphire's logger to add some extra functionality.
 */
export class LoggerWrapper {
  private logger = container.logger;

  public info(...values: readonly unknown[]) {
    this.logger.info(...values);
  }

  public warn(...values: readonly unknown[]) {
    this.logger.warn(...values);
  }

  public error(...values: readonly unknown[]) {
    this.logger.error(...values);
  }

  public debug(...values: readonly unknown[]) {
    this.logger.debug(...values);
  }

  public trace(...values: readonly unknown[]) {
    this.logger.trace(...values);
  }

  public fatal(...values: readonly unknown[]) {
    this.logger.fatal(...values);
  }

  public write(level: LogLevel, ...values: readonly unknown[]) {
    this.logger.write(level, ...values);
  }
}
