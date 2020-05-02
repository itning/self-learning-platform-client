import {Base64} from 'js-base64';

const User = {};

export function resolveToken(token) {
  return JSON.parse(JSON.parse(
    Base64.decode(token.split('.')[1])
  ).loginUser);
}

function init() {
  const token = window.localStorage.getItem('authorization_token');
  if (token === null) {
    return {};
  }
  try {
    return JSON.parse(JSON.parse(
      Base64.decode(
        token.split('.')[1]
      )
    ).loginUser);
  } catch (e) {
    window.localStorage.removeItem('authorization_token');
    return {};
  }
}

User.loginUser = function () {
  return init();
}

User.install = function (Vue, options) {
  Vue.prototype.$user = User;
};
export default User;
