<template>
  <v-form lazy-validation ref="form" v-model="valid">
    <v-text-field
      :rules="passwordRules"
      color="#bb4949"
      label="Senha atual"
      required
      type="password"
      v-model="novaSenha.senhaAtual"
    ></v-text-field>
    <v-text-field
      :rules="newPasswordRules"
      @keyup.enter="validate"
      color="#bb4949"
      label="Nova senha"
      required
      type="password"
      v-model="novaSenha.novaSenha"
    ></v-text-field>
    <v-text-field
      :rules="confirmPasswordRules"
      @keyup.enter="validate"
      color="#bb4949"
      label="Confirmar nova senha"
      required
      type="password"
      v-model="novaSenha.confirmaNovaSenha"
    ></v-text-field>

    <v-alert :type="typeAlert" :value="alert" transition="scale-transition">{{ mensagem }}</v-alert>

    <v-btn
      :disabled="confirmacao"
      :loading="loading"
      @click="validate"
      class="mr-4 mt-3"
      color="escuro"
    >confirmar
    </v-btn>
  </v-form>
</template>

<script>
import {app} from '@/services';

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
        && this.novaSenha.novaSenha === this.novaSenha.confirmaNovaSenha
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
      if (this.novaSenha.novaSenha === '') return true;
      return this.novaSenha.novaSenha !== this.novaSenha.confirmaNovaSenha;
    },
  },
};
</script>

<style>
</style>
