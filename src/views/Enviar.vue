<template>
  <div>
    <PageTitle icone="mdi-credit-card-outline" titulo="Enviar MeritMoney"/>
    <v-row>
      <v-col cols="12">
        <v-alert
          border="left"
          color="green"
          colored-border
          elevation="2"
          icon="mdi-check-circle"
          v-model="transacaoOk"
        >Transação realizada com sucesso!
        </v-alert>

        <v-alert
          border="left"
          color="red"
          colored-border
          elevation="2"
          icon="mdi-alert-circle"
          v-model="transacaoFail"
        >{{ mensagemDeErro }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="md-6 col-12">
        <v-autocomplete
          :items="pessoas"
          :rules="pessoaRules"
          :search-input.sync="procurarPessoa"
          color="#bb4949"
          dense
          item-text="nome"
          item-value="id"
          label="Para:"
          no-data-text="Digite um nome válido para buscar."
          prepend-icon="mdi-account"
          return-object
          v-model="transacao.destinatario"
        >
          <template v-slot:selection="data">
            <v-chip
              :input-value="data.select"
              @click="data.select"
              @click:close="remove"
              close
              v-bind="data.attrs"
            >
              <v-avatar left>
                <v-img :src="data.item.pathFoto"></v-img>
              </v-avatar>
              {{ data.item.nome }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-item-content v-text="data.item"></v-list-item-content>
            </template>
            <template v-else>
              <v-list-item-avatar>
                <img :src="data.item.pathFoto"/>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.nome"></v-list-item-title>
                <v-list-item-subtitle v-html="data.item.equipe.nome"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="col-12 md-6">
        <v-text-field
          :rules="valueRules"
          color="#bb4949"
          label="Valor"
          prepend-icon="mdi-cash"
          v-model.lazy="value"
          v-money="money"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          auto-grow
          clearable
          color="#bb4949"
          counter="80"
          filled
          hint
          label="Deixe uma mensagem"
          max="80"
          name="mensagem"
          v-model="transacao.mensagem"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-container grid-list-xs pa-1>
      <v-row>
        <v-col cols="12">
          <div class="text-end">
            <v-dialog max-width="290" persistent v-model="confirmacao">
              <template v-slot:activator="{ on }">
                <v-btn :disabled="validate" :loading="loading" color="claro" v-on="on">
                  <v-icon left>mdi-send</v-icon>
                  Enviar
                </v-btn>
              </template>
              <Modal
                :mensagem="mensagem2"
                @cancelar="cancelar"
                @confirmar="efetuarTransacao"
                titulo="Confirmar transação"
              />
            </v-dialog>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {app} from '@/services.js';
import Modal from '@/components/Modal';
import PageTitle from '@/components/PageTitle';

export default {
  components: {
    Modal,
    PageTitle,
  },
  data() {
    return {
      loading: true,
      transacaoOk: false,
      transacaoFail: false,
      mensagemDeErro: '',
      value: '',
      procurarPessoa: '',
      confirmacao: false,
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'M$ ',
        suffix: ' ',
        precision: 2,
        masked: false,
      },
      pessoas: [],
      transacao: {
        remetente: {},
        destinatario: {},
        mensagem: '',
        valor: 0,
      },
      pessoaRules: [v => !!v || 'Selecione o destinatário'],
      valueRules: [
        v => this.toFloat() > 0 || 'Coloque um valor válido',
        v => (
          this.toFloat() <= this.transacao.remetente.saldo
          || 'Saldo insuficiente'
        ),
      ],
    };
  },
  mounted() {
    this.$store
      .dispatch('getUsuario')
      .then((r) => {
        this.transacao.remetente = this.$store.state.usuario;
        const {id} = this.$route.params;
        if (id && id !== this.transacao.remetente.id) {
          this.findPessoa(id);
        } else if (id) {
          this.mensagemDeErro = 'Você não pode enviar para você mesmo, sinto muito!';
          this.transacaoFail = true;
        }
        this.loading = false;
      })
      .catch((r) => {
        this.loading = false;
      });
  },
  methods: {
    findPessoa(id) {
      app.findPessoaById(id).then(({data}) => {
        this.pessoas.push(data);
        this.transacao.destinatario = data;
      });
    },
    findPessoaByKeyword(val) {
      app.findPessoaByKeyword(val).then((r) => {
        this.pessoas = r.data.filter(r => r.id !== this.transacao.remetente.id);
      });
    },
    cancelar() {
      this.confirmacao = false;
    },
    remove() {
      this.transacao.destinatario = {};
    },
    toFloat() {
      return parseFloat(
        this.value
          .substring(3)
          .replace(/\./g, '')
          .replace(',', '.'),
      );
    },
    efetuarTransacao() {
      this.loading = true;
      this.confirmacao = false;
      if (this.transacao.remetente.id !== this.transacao.destinatario.id) {
        this.transacao.valor = this.toFloat();
        app
          .efetuarTransacao(this.transacao)
          .then((r) => {
            this.transacaoFail = false;
            this.transacaoOk = true;

            this.loading = false;
          })
          .catch((error) => {
            this.transacaoOk = false;
            this.transacaoFail = true;
            this.mensagemDeErro = error.response.data.message;
            this.loading = false;
          });
      } else {
        this.transacaoOk = false;
        this.transacaoFail = true;
        this.mensagemDeErro = 'Você não pode enviar Merit Money para si mesmo :(';
        this.loading = false;
      }
    },
  },
  watch: {
    procurarPessoa(val) {
      if (val) this.findPessoaByKeyword(val);
    },
  },
  computed: {
    mensagem2() {
      return `Deseja enviar ${this.value} para ${this.transacao.destinatario.nome} ?`;
    },
    validate() {
      return (
        !this.toFloat()
        || !this.transacao.destinatario.nome
        || this.toFloat() > this.transacao.remetente.saldo
      );
    },
  },
};
</script>
