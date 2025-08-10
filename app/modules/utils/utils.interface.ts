export interface IOtp {
  otp: string;
  timestamp: Date;
  expiration_time: string | number;
}

export interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}
