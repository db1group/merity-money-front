import Vue from "vue";
import Router from "vue-router";
import store from "@/store.js";
import Layout from "@/components/Layout";
import Login from "@/views/Login";
import EsqueciMinhaSenha from "@/views/EsqueciMinhaSenha";
import Home from "@/views/Home";
import Colaboradores from "@/views/Colaboradores";
import Perfil from "@/views/Perfil";
import NovaSenha from "@/views/NovaSenha";
import Enviar from "@/views/Enviar";
import Equipes from "@/views/Equipes";
import Equipe from "@/views/Equipe";
import { app } from "./services";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "layout",
      component: Layout,
      meta: {
        login: true
      },
      children: [
        {
          path: "/",
          name: "Home",
          component: Home
        },
        {
          path: "/colaboradores",
          name: "Colaboradores",
          component: Colaboradores
        },
        {
          path: "/enviar/:id?",
          name: "Enviar",
          component: Enviar,
          props: true
        },
        {
          path: "/equipes",
          name: "Equipes",
          component: Equipes
        }
      ]
    },
    {
      path: "/perfil/:id?",
      name: "Perfil",
      component: Perfil,
      meta: {
        login: true
      },
      props: true
    },
    {
      path: "/equipe/:id?",
      name: "Equipe",
      component: Equipe,
      props: true
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/EsqueciMinhaSenha",
      name: "EsqueciMinhaSenha",
      component: EsqueciMinhaSenha
    },
    {
      path: "/novasenha/:hash?",
      name: "NovaSenha",
      component: NovaSenha,
      props: true
    },
    {
      name: "Erro404",
      path: "*",
      redirect: "/erro404"
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.login)) {
    if (!localStorage.token) {
      if (!app.validateToken()) {
        store.dispatch("deslogarUsuario").then(() => {
          next("/login");
        });
      }
    } else if (!app.validateToken()) {
      store.dispatch("deslogarUsuario").then(() => {
        next("/login");
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
