<template>
  <v-toolbar class="menu-toolbar" v-resize="onResize">
    <div class="logo">
      <img src="../assets/db1-logo-box.png" alt="DB1 MeritMoney" class="logotipo" />
      <h1 display-2>
        <span class="merit">Merit</span>
        <span class="money">Money</span>
      </h1>
    </div>
    <v-spacer></v-spacer>
    <v-menu left bottom v-if="isMobile">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="item in menu" :key="item.nome" :to="item.src">
          <v-list-item-title>
            <v-icon>mdi-{{item.icon}}</v-icon>
            &nbsp; {{ item.nome }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title>
            <v-icon>mdi-logout</v-icon>&nbsp;
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-toolbar-items v-else>
      <v-btn text v-for="item in menu" :key="item.nome" :to="item.src">
        <v-icon>mdi-{{item.icon}}</v-icon>
        &nbsp;
        {{item.nome}}
      </v-btn>
      <v-btn text key="logout" @click="logout">
        <v-icon>mdi-logout</v-icon>&nbsp;
        Logout
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: 'HeaderGlobal',
  data() {
    return {
      isMobile: false,
      menu: {
        inicio: {
          icon: 'home-account',
          nome: 'Inicio',
          src: '/',
        },
        colaboradores: {
          icon: 'account-group',
          nome: 'Colaboradores',
          src: '/colaboradores',
        },
        enviar: {
          icon: 'send',
          nome: 'Enviar',
          src: '/enviar',
        },
        equipes: {
          icon: 'account',
          nome: 'Equipes',
          src: '/equipes',
        },
        perfil: {
          icon: 'account',
          nome: 'Perfil',
          src: '/perfil',
        },
      },
    };
  },
  mounted() {
    this.onResize();
  },
  methods: {
    onResize() {
      if (window.innerWidth < 1040) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
    logout() {
      this.$store.dispatch('deslogarUsuario').then(() => {
        this.$router.push({ name: 'Login' });
      });
    },
  },
};
</script>

<style>
.logo {
  display: flex;
  align-items: center;
}
.logotipo {
  width: 50px;
}
.merit {
  font-family: "Flexo Black", Arial, Helvetica, sans-serif;
}
.money {
  font-family: "Flexo", Arial, Helvetica, sans-serif;
}
</style>
