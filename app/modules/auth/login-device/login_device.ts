import LoginDevice from '#models/login_device';
import User from '#models/user';
import { inject } from '@adonisjs/core';
import { DeviceDetector } from '../../../services/deviceDetector/device_detector.js';

@inject()
export class LoginDeviceService {
  constructor(private readonly deviceDetector: DeviceDetector) {}

  async create(user: User, userAgent: string | undefined) {
    const { os, client, device } = this.deviceDetector.detect(userAgent);
    const data = {
      user_id: user.id,
      os: os.name,
      os_version: client.os_version,
      client: client.name,
      client_version: client.version,
      device_type: device.type,
      device_brand: device.brand,
      device_model: device.model,
    };
    return LoginDevice.create(data);
  }
}
