<template>
  <v-container class="login-container">
    <v-layout>
      <v-layout justify-center wrap>
        <v-flex xs12>
          <v-layout justify-center>
            <img alt="DB1 Global Software" class="logo" src="../assets/logo.png"/>
          </v-layout>
        </v-flex>
        <v-flex xs6>
          <v-card :loading="loading" class="mx-auto my-12">
            <v-card-title>
              <v-icon>mdi-login</v-icon>&nbsp; Login
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
                  v-model="login.email"
                ></v-text-field>
                <v-text-field
                  :rules="passwordRules"
                  @keyup.enter="validate"
                  color="#bb4949"
                  label="Senha"
                  required
                  type="password"
                  v-model="login.password"
                ></v-text-field>
                <v-alert :value="alert" prominent type="error">
                  <v-row align="center">
                    <v-col class="grow">{{ mensagem }}</v-col>
                    <v-col class="shrink">
                      <v-btn outlined small to="EsqueciMinhaSenha">Recuperar senha</v-btn>
                    </v-col>
                  </v-row>
                </v-alert>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn
                :disabled="!valid"
                :loading="loading"
                @click="validate"
                class="mr-4"
                color="escuro"
                min-width="100px"
              >Login
              </v-btn>
              <v-btn class="mr-4" color="claro" text to="EsqueciMinhaSenha">Esqueci minha senha</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
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
