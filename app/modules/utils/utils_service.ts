import * as otpGenerator from 'otp-generator'

import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'
import { IOtp } from './utils.interface.js'

@inject()
export class UtilsService {
  public generateOtp(payload: { size: number; validityDuration: number }): IOtp | undefined {
    try {
      const otp = otpGenerator.generate(payload.size, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      })
      const timestamp = new Date()
      timestamp.setSeconds(timestamp.getSeconds() + 10)
      const expiration_time = timestamp
        .setSeconds(timestamp.getSeconds() + payload.validityDuration)
        .toFixed()
      return { otp, timestamp, expiration_time: Number(expiration_time) }
    } catch (error: any) {
      console.error(error)
    }
  }

  public async encryptString(text: string): Promise<string> {
    return await hash.make(text)
  }

  timeElapsed(dateTime: Date) {
    // get the datetime in milliseconds
    const expirationTimeMS = this.dateToMs(dateTime)

    return Date.now() > expirationTimeMS
  }

  dateToMs(dateTime: Date) {
    //convert the date string to date object
    const expirationTime = new Date(dateTime)

    // get the datetime in milliseconds
    return expirationTime.getTime()
  }
}
