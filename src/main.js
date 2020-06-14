import Vue from 'vue';
import money from 'v-money';
import store from '@/store';
import Loading from '@/components/Loading';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.use(money, { precision: 4 });
Vue.config.productionTip = false;

Vue.component('Loading', Loading);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app');
