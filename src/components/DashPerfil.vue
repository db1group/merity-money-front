<template>
  <v-card class="margin-top mx-auto" max-width="260">
    <v-sheet
      class="v-card--offset mx-auto text-center py-5"
      color="escuro"
      elevation="12"
      max-width="120px"
    >
      <h4>{{ valor | meritMoney }}</h4>
    </v-sheet>

    <v-card-text class="pt-0">
      <div class="title font-weight-light mb-2" v-text="titulo"></div>
      <v-divider class="my-2"></v-divider>
      <v-icon class="mr-2" small>mdi-clock</v-icon>
      <span class="caption grey--text font-weight-light">
        <strong>Última transação:</strong>
        {{ ultimaTransacao | timestampConvert }}.
      </span>
      <br/>
      <v-icon class="mr-2" small>mdi-bank-transfer</v-icon>
      <span class="caption grey--text font-weight-light">{{ totalTransacoes }} transações realizadas.</span>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment';

export default {
  name: 'DashPerfil',
  props: {
    id: 0,
    valor: 0,
    titulo: '',
    ultimaTransacao: '',
    totalTransacoes: 0
  },
  filters: {
    meritMoney(valor) {
      return `M$ ${valor}`;
    },
    timestampConvert(timestamp) {
      if (!timestamp) return 'não existe';

      moment.locale('pt-BR');
      return moment(timestamp)
        .startOf('hour')
        .fromNow();
    },
  },
};
</script>

<style scoped>
.v-card--offset {
  top: -20px;
  position: relative;
}

.margin-top {
  margin-top: 28px;
}
</style>
