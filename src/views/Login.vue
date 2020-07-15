<template>
  <v-container class="login-container">
    <v-layout>
      <v-layout justify-center wrap>
        <v-flex xs12>
          <v-layout justify-center>
            <img src="../assets/logo.png" alt="DB1 Global Software" class="logo"/>
          </v-layout>
        </v-flex>
        <v-flex xs6>
          <v-card :loading="loading" class="mx-auto my-12">
            <v-card-title>
              <v-icon>mdi-login</v-icon>&nbsp; Login
            </v-card-title>

            <v-divider class="mx-4"></v-divider>

            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="login.email"
                  type="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  color="#bb4949"
                  @keyup.enter="validate"
                ></v-text-field>
                <v-text-field
                  v-model="login.password"
                  type="password"
                  :rules="passwordRules"
                  label="Senha"
                  color="#bb4949"
                  required
                  @keyup.enter="validate"
                ></v-text-field>
                <v-alert prominent :value="alert" type="error">
                  <v-row align="center">
                    <v-col class="grow">{{ mensagem }}</v-col>
                    <v-col class="shrink">
                      <v-btn small to="EsqueciMinhaSenha" outlined>Recuperar senha</v-btn>
                    </v-col>
                  </v-row>
                </v-alert>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn
                :disabled="!valid"
                :loading="loading"
                color="escuro"
                class="mr-4"
                min-width="100px"
                @click="validate"
              >Login
              </v-btn>
              <v-btn color="claro" class="mr-4" text to="EsqueciMinhaSenha">Esqueci minha senha</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import {app} from '@/services';
import EsqueciMinhaSenha from '@/views/EsqueciMinhaSenha';

export default {
  components: {
    EsqueciMinhaSenha,
  },
  name: 'Login',
  data: () => ({
    loading: false,
    alert: false,
    mensagem: '',
    valid: true,
    login: {
      email: '',
      senha: '',
    },
    passwordRules: [v => !!v || 'Campo senha obrigatório.'],
    emailRules: [
      v => !!v || 'Campo e-mail obrigatório.',
      v => /.+@.+\..+/.test(v) || 'E-mail precisa ser válido',
    ],
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.$store
          .dispatch('logarUsuario', this.login)
          .then((r) => {
            this.loading = false;
            this.$store.dispatch('getUsuario').then((r) => {
              this.$store.state.usuario = r.data;
            });
            this.$router.push('/');
          })
          .catch((r) => {
            this.loading = false;
            this.mensagem = 'Email ou senha inválido';
            this.alert = true;
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
