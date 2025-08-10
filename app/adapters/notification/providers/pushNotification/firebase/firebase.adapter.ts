import env from '#start/env'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import { Notification } from '@notifee/react-native'
import admin from 'firebase-admin'
import { PushNotification } from '../pushNotification.interface.js'

export class FirebaseAdapter implements PushNotification {
  public static appBooted: boolean = false
  public constructor() {
    if (!FirebaseAdapter.appBooted) {
      const credential = FirebaseAdapter.resolveFirebaseCredential()

      admin.initializeApp({
        credential,
      })
      FirebaseAdapter.appBooted = true
    }
  }

  public async sendPushNotification(tokens: string[], notification: Notification): Promise<any> {
    //
    // admin.auth().verifyIdToken()
    try {
      logger.info('Sending push notification using adapter', 'FirebaseAdapter.sendPushNotification')

      const notificationsResponse = await admin.messaging().sendEachForMulticast({
        tokens,
        data: {
          notification: JSON.stringify(notification),
        },
        notification: {
          title: notification.title,
          body: notification.body,
        },
        android: {
          notification: {
            channelId: Date.now().toString(30),
            visibility: 'public',
            priority: 'high',
            defaultSound: true,
          },
        },
      })

      return notificationsResponse.responses.filter((response) => !response.success)
      // TODO: log failed tokens to database
    } catch (e) {
      // todo: log error
      logger.error(e.message, 'FirebaseAdapter.sendPushNotification')
    }
  }

  private static resolveFirebaseCredential(): admin.credential.Credential {
    // Prefer ADC if configured (e.g., GOOGLE_APPLICATION_CREDENTIALS)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return admin.credential.applicationDefault()
    }

    // Support base64-encoded JSON
    const base64Json = env.get('FIREBASE_CREDENTIALS_BASE64')
    if (base64Json) {
      const jsonString = Buffer.from(base64Json, 'base64').toString('utf8')
      const serviceAccount = JSON.parse(jsonString)
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
      }
      return admin.credential.cert(serviceAccount as admin.ServiceAccount)
    }

    // Support plain JSON string
    const rawJson = env.get('FIREBASE_CREDENTIALS_JSON')
    if (rawJson) {
      const serviceAccount = JSON.parse(rawJson)
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
      }
      return admin.credential.cert(serviceAccount as admin.ServiceAccount)
    }

    // As a last resort, try legacy file path via app.makePath if explicitly provided (NOT recommended)
    const legacyPath = env.get('FIREBASE_CREDENTIALS_PATH')
    if (legacyPath) {
      return admin.credential.cert(app.makePath(legacyPath))
    }

    throw new Error(
      'Firebase credentials are not configured. Set one of GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_CREDENTIALS_BASE64, FIREBASE_CREDENTIALS_JSON, or FIREBASE_CREDENTIALS_PATH.'
    )
  }
}
