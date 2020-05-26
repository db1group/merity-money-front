<template>
  <div>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="equipe"
            :items="equipes"
            item-text="nome"
            item-value="id"
            color="claro"
            clearable
            label="Equipes"
            prepend-icon="mdi-account-group"
            @change="atualizarTabela"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            prepend-icon="mdi-magnify"
            v-model="keyword"
            color="claro"
            label="Buscar por nome"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-data-table
      :headers="headers"
      :items="pessoas"
      :items-per-page.sync="size"
      :page.sync="page"
      :server-items-length="totalElements"
      :sort-desc="true"
      no-data-text="Infelizmente não encontramos ninguém :/"
      class="elevation-1"
    >
      <template v-slot:item.foto="{ item }">
        <v-avatar size="38px">
          <img :src="item.pathFoto" :alt="item.nome" pa-2 />
        </v-avatar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn :to="{name: 'Perfil', params: {id: item.id}}" small class="mr-1" color="claro">
              <v-icon small v-on="on">mdi-account</v-icon>
            </v-btn>
          </template>
          <span>Ver Perfil</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn :to="{name: 'Enviar', params: {id: item.id}}" small color="claro">
              <v-icon small v-on="on">mdi-send-circle-outline</v-icon>
            </v-btn>
          </template>
          <span>Enviar MeritMoney</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { app } from "@/services.js";

export default {
  data() {
    return {
      headers: [
        { text: "", value: "foto" },
        {
          text: "Colaborador",
          align: "left",
          sortable: false,
          value: "nome"
        },
        { text: "Email", value: "email" },
        { text: "Equipe", value: "equipe.nome" },
        { text: "Ações", value: "action" }
      ],
      pessoas: [],
      pessoa: {},
      equipes: [],
      equipe: 0,
      keyword: "",
      autoUpdate: true,
      isUpdating: false,
      page: 1,
      size: 5,
      totalElements: 10
    };
  },
  mounted() {
    this.buscarPessoas();
    this.buscarEquipes();
  },
  methods: {
    buscarPessoasPorKeyword() {
      app
        .findPessoaByPageableKeyword(
          this.keyword,
          this.equipe,
          this.getPage(),
          this.size
        )
        .then(r => {
          this.setColaboradores(r.data);
        });
    },
    buscarPessoas() {
      if (this.equipe > 0) {
        this.buscarPessoasPorEquipe();
      } else {
        this.buscarTodasPessoas();
      }
    },
    buscarPessoasPorEquipe() {
      app
        .findPessoasByEquipe(this.equipe, this.getPage(), this.size)
        .then(r => {
          this.setColaboradores(r.data);
        });
    },
    buscarTodasPessoas() {
      app.findAllPessoas(this.getPage(), this.size).then(r => {
        this.setColaboradores(r.data);
      });
    },
    buscarEquipes() {
      app.findAllEquipes().then(r => {
        this.equipes = r.data.filter(
          equipe => equipe.numeroDeColaboradores > 0
        );
      });
    },
    atualizarTabela(id) {
      this.page = 1;
      this.getSearch();
    },
    setColaboradores(data) {
      this.pessoas = data.content;
      this.totalElements = data.totalElements;
    },
    getPage() {
      return this.page - 1;
    },
    getSearch() {
      if (this.keyword.length > 0) {
        this.buscarPessoasPorKeyword();
      } else {
        this.buscarPessoas();
      }
    }
  },
  watch: {
    page() {
      this.getSearch();
    },
    size() {
      this.getSearch();
    },
    keyword() {
      this.getSearch();
    }
  }
};
</script>

<style>
</style>
