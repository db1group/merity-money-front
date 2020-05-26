<template>
  <v-card class="mx-auto" max-width="400">
    <v-img class="white--text align-end" height="200px" :src="equipe.pathFoto">
      <v-card-title class="title justify-space-between">
        <div>{{equipe.nome}}</div>
        <v-chip color="claro">
          <v-icon class="mr-2">mdi-account-group</v-icon>
          {{ " " + equipe.numeroDeColaboradores }}
        </v-chip>
      </v-card-title>
    </v-img>

    <v-card-text class="text--primary">
      <div>{{ showSortDescription() }}</div>
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn color="claro" text :to="{name: 'Equipe', params: {id: equipe.id}}">mais informações</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "EquipeCard",
  props: {
    equipe: {
      type: Object,
      default: {}
    }
  },
  methods: {
    showSortDescription() {
      return this.equipe.descricao
        ? this.equipe.descricao.substring(0, 45) + "..."
        : "";
    }
  }
};
</script>

<style scoped>
.title {
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
}
</style>