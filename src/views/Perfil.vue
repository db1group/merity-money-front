<template>
  <div>
    <HeaderGlobal />
    <v-content class="content" v-resize="onResize">
      <v-container grid-list-xs>
        <v-card class="my-12 mx-auto">
          <v-row class="cover pa-0 ma-0" :style="getPathFoto">
            <v-col cols="3">
              <v-avatar size="200" class="v-sheet--offset mx-auto ml-4 avatar" elevation="12">
                <v-hover v-slot:default="{ hover }">
                  <v-img :src="pessoa.pathFoto" alt="avatar">
                    <v-expand-transition>
                      <div
                        v-if="!isNonEdit && hover"
                        @click="onPickFile"
                        class="d-flex justify-center claro column align-center transition-fast-in-fast-out v-card--reveal display-3 white--text"
                        style="height: 100%; width: 100%; cursor: pointer"
                      >
                        <v-icon>mdi-camera</v-icon>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-hover>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="text-right pr-4" v-if="editable">
              <v-btn class="ma-2" tile color="claro" small v-if="isNonEdit" @click="editarPerfil">
                <v-icon left>mdi-pencil</v-icon>
                {{btnEdit}}
              </v-btn>
              <v-btn class="ma-2" tile color="claro" small v-else @click="salvarPerfil">
                <v-icon left>mdi-content-save-edit</v-icon>
                {{btnSave}}
              </v-btn>
            </v-col>
            <v-col
              cols="9"
              class="pr-4 text-right"
              v-if="!editable && pessoa.linkedin != undefined"
            >
              <v-btn
                class="ma-2"
                tile
                :href="`https://linkedin.com/in/${pessoa.linkedin}`"
                target="_blank"
                color="primary"
              >
                <v-icon left>mdi-linkedin</v-icon>Linkedin
              </v-btn>
            </v-col>
          </v-row>
          <input
            type="file"
            hidden
            ref="profilePictureInput"
            accept="image/png, image/jpeg"
            @change="onFilePicked"
          />

          <v-card-text>
            <v-tabs color="claro" class="mb-4" v-if="!isNonEdit">
              <v-tab @click="isPublico = true">
                <v-icon>mdi-earth</v-icon>&nbsp Perfil
              </v-tab>
              <v-tab @click="isPublico = false">
                <v-icon>mdi-shield-lock</v-icon>&nbsp Trocar senha
              </v-tab>
            </v-tabs>
            <div v-if="isPublico">
              <v-form ref="form" v-model="valid" lazy-validation class="formulario">
                <v-text-field
                  label="Nome"
                  :value="pessoa.nome"
                  v-model="pessoa.nome"
                  :disabled="isNonEdit"
                  color="claro"
                ></v-text-field>
                <v-text-field
                  label="Email"
                  :value="pessoa.email"
                  v-model="pessoa.email"
                  :disabled="isNonEdit"
                  color="claro"
                ></v-text-field>
                <v-text-field
                  label="Usuário Linkedin"
                  :value="pessoa.linkedin"
                  v-model="pessoa.linkedin"
                  v-if="!isNonEdit"
                  prefix="linkedin.com/in/"
                  color="claro"
                >
                  <template v-slot:append>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">mdi-help-circle-outline</v-icon>
                      </template>
                      <h4>Onde encontrar esta informação?</h4>
                      <p>Acesse seu perfil e copie o nome sublinhado abaixo</p>
                      <v-divider class="my-1"></v-divider>
                      <img src="@/assets/linkedin_help.png" alt="Help" style="width: 100%;" />
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-text-field label="Equipe " :value="pessoa.equipe.nome" disabled color="claro"></v-text-field>
              </v-form>
            </div>
            <div v-else>
              <TrocarSenha />
            </div>
          </v-card-text>
        </v-card>

        <v-container>
          <v-row>
            <DashPerfil
              :id="pessoa.id"
              :valor="pessoa.saldo"
              :ultimaTransacao="transacoesDetalhes.ultimoEnvio"
              :totalTransacoes="transacoesDetalhes.total"
              titulo="Saldo Atual"
            />
            <DashPerfil
              :id="pessoa.id"
              :valor="pessoa.credito"
              :ultimaTransacao="transacoesDetalhes.ultimoRecebido"
              :totalTransacoes="transacoesDetalhes.recebidos"
              titulo="Créditos Totais"
            />
            <DashPerfil
              :id="pessoa.id"
              :valor="pessoa.debito"
              :ultimaTransacao="transacoesDetalhes.ultimoEnvio"
              :totalTransacoes="transacoesDetalhes.envios"
              titulo="Débitos Totais"
            />
          </v-row>
        </v-container>
      </v-container>
    </v-content>
    <FooterGlobal />
  </div>
</template>

<script>
import { api, app } from "@/services.js";
import HeaderGlobal from "@/components/HeaderGlobal";
import FooterGlobal from "@/components/FooterGlobal";
import DashPerfil from "@/components/DashPerfil";
import TrocarSenha from "@/components/TrocarSenha";

export default {
  components: {
    HeaderGlobal,
    FooterGlobal,
    DashPerfil,
    TrocarSenha
  },
  name: "Perfil",
  data() {
    return {
      pessoa: {
        equipe: {}
      },
      transacoesDetalhes: {
        envios: 0,
        recebidos: 0,
        total: 0,
        ultimoEnvio: "",
        ultimoRecebido: ""
      },
      picture: null,
      pessoaTmp: {
        nome: "",
        email: "",
        linkedin: ""
      },
      valid: true,
      btnEdit: "Editar Perfil",
      btnSave: "Salvar Alterações",
      isNonEdit: true,
      isPublico: true,
      editable: false
    };
  },
  computed: {
    getPathFoto() {
      return {
        background: `url('${this.pessoa.equipe.pathFoto}') center center/cover no-repeat`
      };
    }
  },
  mounted() {
    const { id } = this.$route.params;
    if (id) {
      this.puxarPessoa(id);
      this.buscarDetalhes(id);
      this.$store.state.usuario.id == id
        ? (this.editable = true)
        : (this.editable = false);
    } else {
      this.$store.dispatch("getUsuario").then(r => {
        this.pessoa = this.$store.state.usuario;
        this.buscarDetalhes(this.pessoa.id);
        this.editable = true;
      });
    }
    this.onResize();
  },
  methods: {
    puxarPessoa(id) {
      app.findPessoaById(id).then(r => {
        this.pessoa = r.data;
      });
    },
    buscarDetalhes(id) {
      app.buscarDetalhesTransacoes(id).then(r => {
        this.transacoesDetalhes = r.data;
      });
    },
    onResize() {
      if (window.innerWidth <= 522) {
        this.btnEdit = "Editar";
        this.btnSave = "Salvar";
      } else {
        this.btnEdit = "Editar Perfil";
        this.btnSave = "Salvar Alterações";
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
        .then(response => {})
        .catch(response => {
          this.pessoa.nome = this.pessoaTmp.nome;
          this.pessoa.email = this.pessoaTmp.email;
          this.pessoa.linkedin = this.pessoaTmp.linkedin;
        });
      if (this.picture != null) {
        const fd = new FormData();
        fd.append("file", this.picture, this.picture.name);
        app.trocarFoto(fd).then(r => {});
      }
    },
    onPickFile(file) {
      this.$refs.profilePictureInput.click();
    },
    onFilePicked(event) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.pessoa.pathFoto = fileReader.result;
      });
      fileReader.readAsDataURL(file);
      this.picture = file;
    }
  }
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
