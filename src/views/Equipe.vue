<template>
  <div>
    <HeaderGlobal />
    <v-container>
      <v-card class="pt-12" :style="getPathFoto">
        <PageTitle
          icone="mdi-rocket"
          :titulo="'Equipe ' + equipe.nome"
          class="px-3 mt-12 pt-12 pageTitle"
        />
      </v-card>
      <ColaboradoresCard :equipeId="getEquipeId" />
    </v-container>
    <FooterGlobal />
  </div>
</template>

<script>
import { app } from "@/services.js";
import HeaderGlobal from "@/components/HeaderGlobal";
import FooterGlobal from "@/components/FooterGlobal";
import PageTitle from "@/components/PageTitle";
import ColaboradoresCard from "@/components/ColaboradoresCard";

export default {
  components: {
    HeaderGlobal,
    FooterGlobal,
    PageTitle,
    ColaboradoresCard
  },
  name: "Perfil",
  data() {
    return {
      equipe: {}
    };
  },
  mounted() {
    const { id } = this.$route.params;
    app.findEquipeById(id).then(r => {
      this.equipe = r.data;
    });
  },
  methods: {},
  computed: {
    getEquipeId() {
      return this.equipe.id;
    },
    getPathFoto() {
      return {
        background: `url('${this.equipe.pathFoto}') center center/cover no-repeat !important`
      };
    }
  }
};
</script>

<style scoped>
.pageTitle {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
}
</style>
