import Vue from "vue";
import Vuex from "vuex";
import { app } from "@/services";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    login: false,
    usuario: {
      id: 0,
      nome: "",
      email: "",
      pathFoto: "",
      equipe: "",
      linkedin: "",
      saldo: 0,
      credito: 0,
      debito: 0
    }
  },
  mutations: {
    UPDATE_LOGIN(state, payload) {
      this.state.login = payload;
    },
    UPDATE_USUARIO(state, payload) {
      this.state.usuario = payload;
    }
  },
  actions: {
    setUsuario(context, usuario) {
      context.commit("UPDATE_USUARIO", usuario);
    },
    logarUsuario(context, payload) {
      return app.login(payload).then(response => {
        window.localStorage.token = response.data;
      });
    },
    getUsuario(context) {
      return app.getUsuario().then(response => {
        context.commit("UPDATE_USUARIO", response.data);
        context.commit("UPDATE_LOGIN", true);
      });
    },
    deslogarUsuario(context) {
      context.commit("UPDATE_USUARIO", {
        id: 0,
        nome: "",
        email: "",
        pathFoto: "",
        equipe: "",
        linkedin: "",
        saldo: 0,
        credito: 0,
        debito: 0
      });
      context.commit("UPDATE_LOGIN", false);
      localStorage.removeItem("token");
    }
  }
});

export default store;
