import User from '#models/user'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import axios from 'axios'
import { IIPInfo } from './login_location.interface.js'
import LoginLocation from '#models/login_location'

export class LoginLocationService {
  async create(user: User, ipAddress: string) {
    logger.info(
      'LoginLocationService.create',
      'Fetching user location with ip address: ' + ipAddress
    )

    const ipinfoUrl: string = env.get('IPINFO_URL')
    const ipinfoToken: string = env.get('IPINFO_TOKEN')

    try {
      const ipinfo = await axios.get(`${ipinfoUrl}/${ipAddress}/json?token=${ipinfoToken}`)
      const { ip, region, loc, country, org }: IIPInfo = ipinfo.data
      const locIndex = loc ? loc.split(',') : ['00000', '00000']

      const data = {
        user_id: user.id,
        latitude: locIndex[0],
        longitude: locIndex[1],
        ip_address: ip,
        region: region,
        country: country,
        isp: org,
      }

      return LoginLocation.create(data)
    } catch (e) {
      logger.error(e.message, 'LoginLocationService.create')
    }
  }
}
