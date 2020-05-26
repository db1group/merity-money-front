<template>
  <div>
    <PageTitle icone="mdi-account-multiple" titulo="Equipes" />

    <div class="d-flex flex-row flex-wrap justify-center my-5">
      <v-col cols="md-6">
        <v-text-field
          prepend-icon="mdi-magnify"
          v-model="keyword"
          color="claro"
          label="Buscar por nome"
        ></v-text-field>
      </v-col>
    </div>

    <div class="d-flex flex-row flex-wrap justify-space-around my-5">
      <div v-for="equipe in equipes" :key="equipe.id" class="my-2">
        <EquipeCard :equipe="equipe" />
      </div>
    </div>

    <div class="text-center">
      <v-pagination v-model="page" color="escuro" :length="totalPages"></v-pagination>
    </div>
  </div>
</template>

<script>
import PageTitle from "@/components/PageTitle";
import EquipeCard from "@/components/EquipeCard";
import { app } from "@/services.js";

export default {
  components: {
    PageTitle,
    EquipeCard
  },
  data() {
    return {
      equipes: [],
      keyword: "",
      totalPages: 0,
      page: 1,
      size: 6
    };
  },
  mounted() {
    this.buscarEquipes();
  },
  methods: {
    buscarEquipes() {
      app.findEquipes(this.getPage(), this.size).then(r => {
        this.salvaEquipes(r.data);
      });
    },
    buscarPorKeyword() {
      app
        .findEquipesByKeyword(this.keyword, this.getPage(), this.size)
        .then(r => {
          this.salvaEquipes(r.data);
        });
    },
    salvaEquipes(data) {
      this.equipes = data.content.sort(
        (a, b) => b.numeroDeColaboradores - a.numeroDeColaboradores
      );
      this.totalPages = Math.ceil(data.totalElements / this.size);
    },
    getPage() {
      return this.page - 1;
    },
    getEquipes() {
      if (this.keyword.length > 0) {
        this.buscarPorKeyword();
      } else {
        this.buscarEquipes();
      }
    }
  },
  watch: {
    keyword() {
      this.page = 1;
      this.getEquipes();
    },
    page() {
      this.getEquipes();
    }
  }
};
</script>

<style>
</style>
