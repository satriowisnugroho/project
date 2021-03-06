import _ from 'lodash';
import { utils } from '../../../common/utils';

export const ROLE_ALL = '*';

/**
 * Auth middleware
 * @param {array} roles
 * @param {string|function} failedCb
 */
export function auth(roles, failedCb) {
  const reject = (req, res, next) => {
    if (utils.isFunction(failedCb)) return failedCb(req, res);
    const err = new Error('Access denied.');
    return next(err);
  };

  return (req, res, next) => {
    if (req.isAuthenticated()) {
      if (!roles || roles === ROLE_ALL) return next();

      roles = utils.isArray(roles) ? roles : [roles];
      const user = req.user || {};
      // fix role
      if (_.includes(roles, user.role)) return next();
    }

    return reject(req, res);
  };
}
