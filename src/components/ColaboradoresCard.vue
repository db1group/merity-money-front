<template>
  <div>
    <div class="d-flex flex-row justify-center mt-5">
      <h3>COLABORADORES</h3>
    </div>
    <div class="d-flex flex-row justify-space-between">
      <div class="d-flex flex-column justify-center">
        <v-btn :disabled="previousDisable" @click="previousPage" class="ma-2" icon text>
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </div>
      <div class="py-4 d-flex flex-row flex-wrap justify-space-around" style="width: 100%;">
        <div v-if="colaboradores.length == 0">
          <h4 class="information">Esta equipe ainda não possui colaboradores :/</h4>
        </div>
        <v-card
          :key="colaborador.id"
          class="mb-6"
          max-width="344px"
          outlined
          v-for="colaborador in colaboradores"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">{{ colaborador.email }}</div>
              <v-list-item-title class="headline mb-1">{{ colaborador.nome }}</v-list-item-title>
              <v-list-item-subtitle>M${{ colaborador.saldo }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar color="grey" size="80" tile>
              <img :alt="colaborador.nome" :src="colaborador.pathFoto"/>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-actions class="justify-space-between">
            <div>
              <v-btn :to="{name: 'Perfil', params: {id: colaborador.id}}" text>
                <v-icon>mdi-account</v-icon>&nbsp; Perfil
              </v-btn>
              <v-btn :to="{name: 'Enviar', params: {id: colaborador.id}}" text>
                <v-icon>mdi-send-circle-outline</v-icon>&nbsp; Enviar
              </v-btn>
            </div>
            <div>
              <v-btn
                :href="`https://www.linkedin.com/in/${colaborador.linkedin}`"
                icon
                small
                target="_blank"
                text
                v-if="colaborador.linkedin != undefined"
              >
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </div>
      <div class="d-flex flex-column justify-center">
        <v-btn :disabled="nextDisable" @click="nextPage" class="ma-2" icon text>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {app} from '@/services.js';

export default {
  name: 'ColaboradoresCard',
  props: {
    equipeId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      colaboradores: [],
      size: 3,
      page: 0,
      maxPage: 0,
      previousDisable: true,
      nextDisable: false,
    };
  },
  mounted() {
    this.getColaboradores();
  },
  methods: {
    getColaboradores() {
      if (!this.equipeId) return;
      app.findPessoasByEquipe(this.equipeId, this.page, this.size).then((r) => {
        this.colaboradores = r.data.content.sort((a, b) => b.saldo - a.saldo);
        this.maxPage = r.data.totalPages - 1;
        if (this.maxPage === 0 || this.colaboradores.length === 0) {
          this.nextDisable = true;
        }
        console.log(this.colaboradores);
      });
    },
    nextPage() {
      if (this.page < this.maxPage) {
        this.nextPage();
        this.getColaboradores();
      }
    },
    previousPage() {
      if (this.page > 0) {
        this.previousPage();
        this.getColaboradores();
      }
    },
  },
  watch: {
    equipeId() {
      this.getColaboradores();
    },
    page() {
      if (this.page > 0) {
        this.previousDisable = false;
      } else {
        this.previousDisable = true;
      }
      if (this.page < this.maxPage) {
        this.nextDisable = false;
      } else {
        this.nextDisable = true;
      }
    },
  },
};
</script>

<style scoped>
.information {
  color: #ccc;
}
</style>
