import Vue from 'vue';
import money from 'v-money';
import App from './App.vue';
import router from './router';
import store from '@/store';
import vuetify from './plugins/vuetify';
import Loading from '@/components/Loading';

Vue.use(money, { precision: 4 });
Vue.config.productionTip = false;

Vue.component('Loading', Loading);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app');
