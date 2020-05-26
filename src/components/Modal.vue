<template>
  <v-card>
    <v-card-title class="headline" v-text="titulo"></v-card-title>
    <v-card-text v-text="mensagem"></v-card-text>
    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn color="red darken-1" text @click="cancelar">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="confirmar">Confirmar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    mensagem: "",
    titulo: ""
  },
  methods: {
    cancelar() {
      this.$emit("cancelar");
    },
    confirmar() {
      this.$emit("confirmar");
    }
  }
};
</script>
