<template>
  <v-card>
    <v-card-title class="headline" v-text="titulo"></v-card-title>
    <v-card-text v-text="mensagem"></v-card-text>
    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn @click="cancelar" color="red darken-1" text>Cancelar</v-btn>
      <v-btn @click="confirmar" color="green darken-1" text>Confirmar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    mensagem: '',
    titulo: '',
  },
  methods: {
    cancelar() {
      this.$emit('cancelar');
    },
    confirmar() {
      this.$emit('confirmar');
    },
  },
};
</script>
