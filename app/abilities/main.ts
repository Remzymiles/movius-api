/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import { Bouncer } from '@adonisjs/bouncer';
import { safeEqual } from '@adonisjs/core/helpers';
import User from '../models/user.js';

/**
 * Delete the following ability to start from
 * scratch
 */
export const viewTransaction = Bouncer.ability((user: User, transaction: Record<'user_id', number>) => {
  return safeEqual(user.id.toString(), transaction.user_id.toString());
});

/**
 *
 *
 */
export const isAdmin = Bouncer.ability((user: User) => {
  return !!user.roles.find(role => safeEqual(role.slug, 'admin') || safeEqual(role.slug, 'super-admin'));
});
