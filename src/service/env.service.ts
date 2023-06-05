export class EnvService {
  public static isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }
}
