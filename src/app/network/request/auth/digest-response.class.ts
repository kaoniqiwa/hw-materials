export class DigestResponse {
  realm: string = '';
  qop: string = '';
  nonce: string = '';
  opaque: string = '';
  [key: string]: string;
}
