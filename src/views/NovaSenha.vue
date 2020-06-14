<template>
  <v-container class="login-container">
    <v-layout>
      <v-layout justify-center wrap>
        <v-flex xs6>
          <v-card :loading="loading" class="mx-auto my-12">
            <v-card-title>
              <v-icon>mdi-lock-reset</v-icon>&nbsp; Nova senha
            </v-card-title>

            <v-divider class="mx-4"></v-divider>

            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="novaSenha.email"
                  type="email"
                  disabled
                  label="E-mail"
                  color="#bb4949"
                ></v-text-field>
                <v-text-field
                  v-model="novaSenha.senha"
                  type="password"
                  :rules="passwordRules"
                  label="Senha"
                  color="#bb4949"
                  required
                  @keyup.enter="validate"
                ></v-text-field>
                <v-text-field
                  v-model="novaSenha.confirmaSenha"
                  type="password"
                  :rules="confirmPasswordRules"
                  label="Confirmar Senha"
                  color="#bb4949"
                  required
                  @keyup.enter="validate"
                ></v-text-field>
                <v-alert :value="alert" type="error" transition="scale-transition">{{mensagem}}</v-alert>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn
                :disabled="confirmacao"
                :loading="loading"
                color="escuro"
                class="mr-4"
                @click="validate"
              >confirmar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import { app } from '@/services';

export default {
  name: 'NovaSenha',
  data: () => ({
    loading: false,
    alert: false,
    mensagem: '',
    valid: true,
    novaSenha: {
      hash: '',
      email: '',
      senha: '',
      confirmaSenha: '',
    },
    passwordRules: [v => !!v || 'Campo senha obrigatório.'],
    confirmPasswordRules: [v => !!v || 'Campo confirmar senha obrigatório.'],
  }),
  mounted() {
    this.novaSenha.hash = this.$route.params.hash;
    app
      .getEmailByHash(this.novaSenha.hash)
      .then((r) => {
        this.novaSenha.email = r.data;
      })
      .catch((r) => {
        this.mensagem = r.data;
      });
  },
  methods: {
    validate() {
      if (
        this.$refs.form.validate()
        && this.novaSenha.senha === this.novaSenha.confirmaSenha
      ) {
        this.loading = true;
        app
          .changePasswordByHash(this.novaSenha.hash, this.novaSenha.senha)
          .then((r) => {
            this.loading = false;
            this.$router.push('/');
          })
          .catch((r) => {
            this.loading = false;
            this.mensagem = r.response.data.message;
            this.alert = true;
          });
      }
    },
  },
  computed: {
    confirmacao() {
      if (this.novaSenha.senha === '') return true;
      return this.novaSenha.senha !== this.novaSenha.confirmaSenha;
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  align-items: center;
  display: flex;
}
.logo {
  width: 50%;
}
</style>
