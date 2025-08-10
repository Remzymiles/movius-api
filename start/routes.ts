/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { UserDeleteRequestController } from '../app/modules/auth/user-delete-request/user_delete_request.controller.js'
import { middleware } from './kernel.js'

const RegistersController = () => import('../app/modules/auth/register/register_controller.js')
const LoginController = () => import('../app/modules/auth/login/login_controller.js')
const PasswordResetController = () =>
  import('../app/modules/auth/password-reset/password_reset.controller.js')
const UserController = () => import('../app/modules/auth/user/user_controller.js')


router.get('/', async () => {
  return {
    hello: 'world',
  }
})


// AUTH routes
router
  .group(() => {
    router
      .group(() => {
        router.post('/', [RegistersController, 'register'])
        router.post('/check', [RegistersController, 'checkRegisterUserDetails'])
        router.patch('/resend', [RegistersController, 'resendVerificationMail'])
        router.post('/verify', [RegistersController, 'verifyAccount'])
      })
      .prefix('/register')

    router
      .group(() => {
        router.post('/', [LoginController, 'login'])
      })
      .prefix('/login')

    router
      .group(() => {
        router.post('/', [PasswordResetController, 'initiate'])
        router.post('/verify-token', [PasswordResetController, 'verifyToken'])
        router.post('/reset', [PasswordResetController, 'updatePassword'])
        router.patch('/resend', [PasswordResetController, 'initiate'])
        router
          .post('/change', [PasswordResetController, 'changePassword'])
          .use(middleware.auth())
          .use(middleware.userRole({ roles: ['active'] }))
      })
      .prefix('/password-reset')

    router.post('/password-resets/update-password/reset', [
      PasswordResetController,
      'updatePassword',
    ])

    router
      .group(() => {
        router
          .post('/', [UserController, 'update'])
          .use(middleware.auth())
          .use(middleware.userRole({ roles: ['active'] }))
        router
          .patch('/', [UserController, 'update'])
          .use(middleware.auth())
          .use(middleware.userRole({ roles: ['active'] }))
        router
          .patch('/password', [UserController, 'changePassword'])
          .use(middleware.auth())
          .use(middleware.userRole({ roles: ['active'] }))
        router
          .get('/authenticated/me', [UserController, 'getAuthenticatedUser'])
          .use(middleware.auth())
          .use(middleware.userRole({ roles: ['active'] }))
      })
      .prefix('/users')

    router
      .group(() => {
        router.group(() => {
          router.post('/', [UserDeleteRequestController, 'requestAccountDeletion'])
          router.get('/', [UserDeleteRequestController, 'findAll'])
          router.get('/:id', [UserDeleteRequestController, 'findOne'])
          router.patch('/:id', [UserDeleteRequestController, 'removeDeleteRequest'])
          router.delete('/:id', [UserDeleteRequestController, 'approveDeleteRequest'])
        })
      })
      .use(middleware.auth())
      .use(middleware.userRole({ roles: ['active'] }))
      .prefix('/user-delete-request')
  })
  .prefix('/auth')
