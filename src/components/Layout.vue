<template>
  <div>
    <div v-if="loading">
      <Loading/>
    </div>
    <div v-else>
      <HeaderGlobal/>
      <v-content class="content">
        <v-container>
          <transition mode="out-in" name="slide-fade">
            <router-view></router-view>
          </transition>
        </v-container>
      </v-content>
      <FooterGlobal/>
    </div>
  </div>
</template>

<script>
import HeaderGlobal from './HeaderGlobal';
import FooterGlobal from './FooterGlobal';
import Loading from './Loading';

export default {
  name: 'Layout',
  components: {
    HeaderGlobal,
    FooterGlobal,
    Loading,
  },
  data() {
    return {
      loading: true,
    };
  },
  methods: {},
  mounted() {
    this.loading = false;
  },
};
</script>

<style scoped>
.content {
  margin-bottom: 65px;
}

.slide-fade-enter-active {
  transition: all 0.1s ease;
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active em versões anteriores a 2.1.8 */
{
  transform: translateX(3px);
  opacity: 0;
}
</style>
