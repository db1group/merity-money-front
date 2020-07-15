<template>
  <v-container class="login-container">
    <v-layout>
      <v-layout justify-center wrap>
        <v-flex xs6>
          <v-card :loading="loading" class="mx-auto my-12">
            <v-btn icon text to="Login">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-card-title>
              <v-icon>mdi-lock-question</v-icon>&nbsp; Recuperar senha
            </v-card-title>

            <v-divider class="mx-4"></v-divider>

            <v-card-text>
              <v-form lazy-validation ref="form" v-model="valid">
                <v-text-field
                  :rules="emailRules"
                  @keyup.enter="validate"
                  color="#bb4949"
                  label="E-mail"
                  required
                  type="email"
                  v-model="user.email"
                ></v-text-field>
                <v-alert :value="alert" transition="scale-transition" type="error">{{ mensagem }}</v-alert>
                <v-alert
                  :value="success"
                  transition="scale-transition"
                  type="success"
                >{{ successMessage }}
                </v-alert>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn :loading="loading" @click="validate" class="mr-4" color="escuro">confirmar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import {app} from '@/services';

export default {
  name: 'EsqueciMinhaSenha',
  data: () => ({
    loading: false,
    alert: false,
    success: false,
    successMessage: '',
    mensagem: '',
    valid: true,
    user: {
      email: '',
    },
    emailRules: [
      v => !!v || 'Campo e-mail obrigatório.',
      v => /.+@.+\..+/.test(v) || 'E-mail precisa ser válido',
    ],
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        app
          .forgotPassword(this.user)
          .then((r) => {
            this.loading = false;
            this.success = true;
            this.alert = false;
            this.successMessage = 'Solicitação aceita. Verifique seu email.';
          })
          .catch((r) => {
            this.loading = false;
            this.alert = true;
            this.success = false;
            this.mensagem = r.response.data.message;
          });
      }
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
