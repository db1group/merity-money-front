<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="novaSenha.senhaAtual"
      type="password"
      :rules="passwordRules"
      label="Senha atual"
      required
      color="#bb4949"
    ></v-text-field>
    <v-text-field
      v-model="novaSenha.novaSenha"
      type="password"
      :rules="newPasswordRules"
      label="Nova senha"
      color="#bb4949"
      required
      @keyup.enter="validate"
    ></v-text-field>
    <v-text-field
      v-model="novaSenha.confirmaNovaSenha"
      type="password"
      :rules="confirmPasswordRules"
      label="Confirmar nova senha"
      color="#bb4949"
      required
      @keyup.enter="validate"
    ></v-text-field>

    <v-alert :value="alert" :type="typeAlert" transition="scale-transition">{{mensagem}}</v-alert>

    <v-btn
      :disabled="confirmacao"
      :loading="loading"
      color="escuro"
      class="mr-4 mt-3"
      @click="validate"
    >confirmar</v-btn>
  </v-form>
</template>

<script>
import { app } from '@/services';

export default {
  name: 'TrocarSenha',
  data: () => ({
    loading: false,
    alert: false,
    typeAlert: 'error',
    mensagem: '',
    valid: true,
    novaSenha: {
      senhaAtual: '',
      novaSenha: '',
      confirmaNovaSenha: '',
    },
    newPasswordRules: [v => !!v || 'Campo nova senha obrigatório.'],
    passwordRules: [v => !!v || 'Campo nova senha obrigatório.'],
    confirmPasswordRules: [v => !!v || 'Campo confirmar senha obrigatório.'],
  }),
  methods: {
    validate() {
      if (
        this.$refs.form.validate()
        && this.novaSenha.novaSenha == this.novaSenha.confirmaNovaSenha
      ) {
        this.loading = true;
        app
          .trocarSenha(this.novaSenha.senhaAtual, this.novaSenha.novaSenha)
          .then(() => {
            this.alert = true;
            this.typeAlert = 'success';
            this.loading = false;
            this.mensagem = 'Senha atualizada com sucesso!';
          })
          .catch((error) => {
            this.loading = false;
            this.typeAlert = 'error';
            this.alert = true;
            this.mensagem = error.response.data.message;
          });
      }
    },
  },
  computed: {
    confirmacao() {
      if (this.novaSenha.novaSenha == '') return true;
      return this.novaSenha.novaSenha != this.novaSenha.confirmaNovaSenha;
    },
  },
};
</script>

<style>
</style>
