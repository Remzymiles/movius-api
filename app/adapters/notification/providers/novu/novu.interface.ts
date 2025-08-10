import { ITriggerPayloadOptions } from '@novu/node';

export interface NovuConfig {
  subscriberId: string;
}

export interface NovuOptions {
  otp?: string;
}

export interface NovuBuildMessage {
  eventName: string;
  payload: ITriggerPayloadOptions;
}
