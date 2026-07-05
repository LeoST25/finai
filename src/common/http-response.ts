export class HttpResponse<T> {
  constructor(
    public success: boolean,
    public data: T | null,
    public message: string,
  ) {}

  static ok<T>(data: T, message = 'OK') {
    return new HttpResponse(true, data, message);
  }

  static fail(message: string) {
    return new HttpResponse(false, null, message);
  }
}