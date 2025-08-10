// eslint-disable-next-line @typescript-eslint/no-var-requires
import { default as Detector } from 'node-device-detector'
interface IDeviceDetector {
  detect?: (params: any) => any
}

export class DeviceDetector extends (Detector as any) implements IDeviceDetector {}
