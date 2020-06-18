<template>
  <v-card class="mt-5">
    <v-card-title>
      <h3 v-if="isEnvios">Envios</h3>
      <h3 v-else>Recebidos</h3>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="transacoes"
      :custom-sort="customSort"
      :loading="loading"
      :page.sync="page"
      :items-per-page.sync="size"
      :server-items-length="totalElements"
      no-data-text="Não encontramos transações :/"
      loading-text="Buscando transações"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="item in items" :key="item.dateTime">
            <td v-if="isEnvios">
              <v-avatar size="38px">
                <img :src="item.destinatario.pathFoto" :alt="item.destinatario.nome" pa-2 />
              </v-avatar>
              &nbsp; {{ item.destinatario.nome }}
            </td>
            <td v-else>
              <v-avatar size="38px">
                <img :src="item.remetente.pathFoto" :alt="item.remetente.nome" pa-2 />
              </v-avatar>
              &nbsp; {{ item.remetente.nome }}
            </td>
            <td>
              <v-chip color="escuro">{{ item.valor | meritMoney}}</v-chip>
            </td>
            <td>{{ item.mensagem }}</td>
            <td>{{ item.dateTime | timestampConvert}}</td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import moment from 'moment';
import { app } from '@/services.js';

export default {
  name: 'TabelaTransacoes',
  props: {
    isEnvios: true,
  },
  data() {
    return {
      loading: true,
      transacoes: [],
      headers: [
        {
          text: 'Destinatário',
          align: 'left',
          value: 'destinatario.nome',
        },
        { text: 'Valor', value: 'valor' },
        { text: 'Mensagem', value: 'mensagem' },
        { text: 'Data', value: 'dateTime' },
      ],
      idUsuario: 0,
      isDesc: true,
      size: 5,
      page: 1,
      totalElements: 1,
    };
  },
  mounted() {
    this.$store.dispatch('getUsuario').then(() => {
      this.idUsuario = this.$store.state.usuario.id;
      this.getTransacoes();
    });
  },
  methods: {
    buscarEnvios() {
      this.loading = true;
      return app
        .buscarEnvios(this.idUsuario, this.page - 1, this.size)
        .then((r) => {
          this.setItems(r.data);
        })
        .catch(() => (this.loading = false));
    },
    buscarRecebidos() {
      this.loading = true;
      return app
        .buscarRecebidos(this.idUsuario, this.page - 1, this.size)
        .then((r) => {
          this.setItems(r.data);
        })
        .catch(() => (this.loading = false));
    },
    setItems(data) {
      this.loading = false;
      this.transacoes = data.content;
      this.totalElements = data.totalElements;
    },
    getTransacoes() {
      if (this.isEnvios) {
        this.buscarEnvios();
      } else {
        this.headers[0].text = 'Remetente';
        this.headers[0].value = 'remetente.nome';
        this.buscarRecebidos();
      }
    },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index === 'dataTime') {
          if (!isDesc) {
            return dateHelp.compare(a.dataTime, b.dataTime);
          }
          return dateHelp.compare(b.dataTime, a.dataTime);
        }
        if (!isDesc) {
          return a[index] < b[index] ? -1 : 1;
        }
        return b[index] < a[index] ? -1 : 1;
      });
      return items;
    },
  },
  filters: {
    meritMoney(valor) {
      return `M$ ${valor}`;
    },
    timestampConvert(timestamp) {
      if (!timestamp) return 'não existe';

      moment.locale('pt-BR');
      return moment(timestamp).fromNow();
    },
  },
  watch: {
    page() {
      this.getTransacoes();
    },
    size() {
      this.getTransacoes();
    },
  },
};
</script>

<style>
</style>
