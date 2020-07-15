<template>
  <div>
    <HeaderGlobal/>
    <v-content class="content" v-resize="onResize">
      <v-container grid-list-xs>
        <v-card class="my-12 mx-auto">
          <v-row :style="getPathFoto" class="cover pa-0 ma-0">
            <v-col cols="3">
              <v-avatar class="v-sheet--offset mx-auto ml-4 avatar" elevation="12" size="200">
                <v-hover v-slot:default="{ hover }">
                  <v-img :src="pessoa.pathFoto" alt="avatar">
                    <v-expand-transition>
                      <div
                        @click="onPickFile"
                        class="d-flex justify-center claro column align-center transition-fast-in-fast-out v-card--reveal display-3 white--text"
                        style="height: 100%; width: 100%; cursor: pointer"
                        v-if="!isNonEdit && hover"
                      >
                        <v-icon>mdi-camera</v-icon>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-hover>
              </v-avatar>
            </v-col>
            <v-col class="text-right pr-4" cols="9" v-if="editable">
              <v-btn @click="editarPerfil" class="ma-2" color="claro" small tile v-if="isNonEdit">
                <v-icon left>mdi-pencil</v-icon>
                {{ btnEdit }}
              </v-btn>
              <v-btn @click="salvarPerfil" class="ma-2" color="claro" small tile v-else>
                <v-icon left>mdi-content-save-edit</v-icon>
                {{ btnSave }}
              </v-btn>
            </v-col>
            <v-col
              class="pr-4 text-right"
              cols="9"
              v-if="!editable && pessoa.linkedin != undefined"
            >
              <v-btn
                :href="`https://linkedin.com/in/${pessoa.linkedin}`"
                class="ma-2"
                color="primary"
                target="_blank"
                tile
              >
                <v-icon left>mdi-linkedin</v-icon>
                Linkedin
              </v-btn>
            </v-col>
          </v-row>
          <input
            @change="onFilePicked"
            accept="image/png, image/jpeg"
            hidden
            ref="profilePictureInput"
            type="file"
          />

          <v-card-text>
            <v-tabs class="mb-4" color="claro" v-if="!isNonEdit">
              <v-tab @click="isPublico = true">
                <v-icon>mdi-earth</v-icon>&nbsp; Perfil
              </v-tab>
              <v-tab @click="isPublico = false">
                <v-icon>mdi-shield-lock</v-icon>&nbsp; Trocar senha
              </v-tab>
            </v-tabs>
            <div v-if="isPublico">
              <v-form class="formulario" lazy-validation ref="form" v-model="valid">
                <v-text-field
                  :disabled="isNonEdit"
                  :value="pessoa.nome"
                  color="claro"
                  label="Nome"
                  v-model="pessoa.nome"
                ></v-text-field>
                <v-text-field
                  :disabled="isNonEdit"
                  :value="pessoa.email"
                  color="claro"
                  label="Email"
                  v-model="pessoa.email"
                ></v-text-field>
                <v-text-field
                  :value="pessoa.linkedin"
                  color="claro"
                  label="Usuário Linkedin"
                  prefix="linkedin.com/in/"
                  v-if="!isNonEdit"
                  v-model="pessoa.linkedin"
                >
                  <template v-slot:append>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">mdi-help-circle-outline</v-icon>
                      </template>
                      <h4>Onde encontrar esta informação?</h4>
                      <p>Acesse seu perfil e copie o nome sublinhado abaixo</p>
                      <v-divider class="my-1"></v-divider>
                      <img alt="Help" src="@/assets/linkedin_help.png" style="width: 100%;"/>
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-text-field :value="pessoa.equipe.nome" color="claro" disabled label="Equipe "></v-text-field>
              </v-form>
            </div>
            <div v-else>
              <TrocarSenha/>
            </div>
          </v-card-text>
        </v-card>

        <v-container>
          <v-row>
            <DashPerfil
              :id="pessoa.id"
              :totalTransacoes="transacoesDetalhes.total"
              :ultimaTransacao="transacoesDetalhes.ultimoEnvio"
              :valor="pessoa.saldo"
              titulo="Saldo Atual"
            />
            <DashPerfil
              :id="pessoa.id"
              :totalTransacoes="transacoesDetalhes.recebidos"
              :ultimaTransacao="transacoesDetalhes.ultimoRecebido"
              :valor="pessoa.credito"
              titulo="Créditos Totais"
            />
            <DashPerfil
              :id="pessoa.id"
              :totalTransacoes="transacoesDetalhes.envios"
              :ultimaTransacao="transacoesDetalhes.ultimoEnvio"
              :valor="pessoa.debito"
              titulo="Débitos Totais"
            />
          </v-row>
        </v-container>
      </v-container>
    </v-content>
    <FooterGlobal/>
  </div>
</template>

<script>
import {app} from '@/services.js';
import HeaderGlobal from '@/components/HeaderGlobal.vue';
import FooterGlobal from '@/components/FooterGlobal.vue';
import DashPerfil from '@/components/DashPerfil.vue';
import TrocarSenha from '@/components/TrocarSenha.vue';

export default {
  components: {
    HeaderGlobal,
    FooterGlobal,
    DashPerfil,
    TrocarSenha,
  },
  name: 'Perfil',
  data() {
    return {
      pessoa: {
        equipe: {},
      },
      transacoesDetalhes: {
        envios: 0,
        recebidos: 0,
        total: 0,
        ultimoEnvio: '',
        ultimoRecebido: '',
      },
      picture: null,
      pessoaTmp: {
        nome: '',
        email: '',
        linkedin: '',
      },
      valid: true,
      btnEdit: 'Editar Perfil',
      btnSave: 'Salvar Alterações',
      isNonEdit: true,
      isPublico: true,
      editable: false,
    };
  },
  computed: {
    getPathFoto() {
      return {
        background: `url('${this.pessoa.equipe.pathFoto}') center center/cover no-repeat`,
      };
    },
  },
  mounted() {
    const {id} = this.$route.params;
    if (id) {
      this.puxarPessoa(id);
      this.buscarDetalhes(id);
      this.$store.state.usuario.id === id
        ? (this.editable = true)
        : (this.editable = false);
    } else {
      this.$store.dispatch('getUsuario').then((r) => {
        this.pessoa = this.$store.state.usuario;
        this.buscarDetalhes(this.pessoa.id);
        this.editable = true;
      });
    }
    this.onResize();
  },
  methods: {
    puxarPessoa(id) {
      app.findPessoaById(id).then((r) => {
        this.pessoa = r.data;
      });
    },
    buscarDetalhes(id) {
      app.buscarDetalhesTransacoes(id).then((r) => {
        this.transacoesDetalhes = r.data;
      });
    },
    onResize() {
      if (window.innerWidth <= 522) {
        this.btnEdit = 'Editar';
        this.btnSave = 'Salvar';
      } else {
        this.btnEdit = 'Editar Perfil';
        this.btnSave = 'Salvar Alterações';
      }
    },
    editarPerfil() {
      this.isNonEdit = false;
      this.pessoaTmp.nome = this.pessoa.nome;
      this.pessoaTmp.email = this.pessoa.email;
    },
    salvarPerfil() {
      this.isNonEdit = true;
      this.isPublico = true;
      app
        .atualizarCadastro(this.pessoa)
        .then((response) => {
        })
        .catch((response) => {
          this.pessoa.nome = this.pessoaTmp.nome;
          this.pessoa.email = this.pessoaTmp.email;
          this.pessoa.linkedin = this.pessoaTmp.linkedin;
        });
      if (this.picture != null) {
        const fd = new FormData();
        fd.append('file', this.picture, this.picture.name);
        app.trocarFoto(fd).then((r) => {
        });
      }
    },
    onPickFile(file) {
      this.$refs.profilePictureInput.click();
    },
    onFilePicked(event) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.pessoa.pathFoto = fileReader.result;
      });
      fileReader.readAsDataURL(file);
      this.picture = file;
    },
  },
};
</script>

<style scoped>
.avatar {
  background: #fff;
  box-shadow: 0 0 10px #000;
}

.v-sheet--offset {
  top: -60px;
  position: relative;
}

.content {
  margin-bottom: 65px;
}
</style>
