import {Base64} from 'js-base64';

const User = {};

function init() {
    if (window.localStorage.getItem('authorization_token') === null) {
        return {};
    }
    try {
        return JSON.parse(JSON.parse(
            Base64.decode(
                window.localStorage.getItem('authorization_token')
                    .split('.')[1]
            )
        ).loginUser);
    } catch (e) {
        window.localStorage.removeItem('authorization_token');
        return {};
    }
}
User.loginUser = init();

User.install = function (Vue, options) {
    Vue.prototype.$user = User;
};
export default User;
