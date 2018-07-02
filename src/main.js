import { app } from 'hyperapp';
import { location } from '@hyperapp/router';
import 'mdn-polyfills/CustomEvent';
import Cookies from 'js-cookie';
import mdui from 'mdui';
import { defaults } from 'mdclub-sdk-js';
import '../node_modules/mdui/dist/css/mdui.min.css';
import '../node_modules/highlight.js/styles/github-gist.css';

import './init';
import './init/index.less';

import actions from './init/actions';
import state from './init/state';
import view from './init/view';

// 设置 API 默认参数
defaults.token = Cookies.get('token');
defaults.baseURL = window.G_API;
defaults.error = function () {
  mdui.snackbar('网络连接失败');
};

document.body.innerHTML = '';

window.main = app(state, actions, view, document.body);
location.subscribe(window.main.location);

// 读取当前登陆用户
const user = window.G_USER;
if (user) {
  window.main.user.setState({ user });
  window.G_USER = null;
}