import axios from 'axios';
import store from '@/store.js';
import router from '@/router.js';

let url = 'http://localhost:8082'; // you must hardcode it somewhere. In production you don't.
if (process.env.NODE_ENV !== 'development') {
  url = '/api';
}
const axiosInstance = axios.create({
  baseURL: `${url}/`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = window.localStorage;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  config => config,
  (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    if (status === 403) {
      control();
    }
  },
);

function control() {
  store.dispatch('deslogarUsuario').then(() => {
    router.push({ name: 'Login' });
  });
}

export const api = {
  get(endpoint) {
    return axiosInstance.get(endpoint);
  },
  post(endpoint, body) {
    return axiosInstance.post(endpoint, body);
  },
  upload(endpoint, body) {
    return axiosInstance.post(endpoint, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  put(endpoint, body) {
    return axiosInstance.put(endpoint, body);
  },
  delete(endpoint, body) {
    return axiosInstance.delete(endpoint, body);
  },
};

export const app = {
  /* PESSOAS */
  findPessoaById(id) {
    return api.get(`/pessoas/${id}`);
  },
  findAllPessoas(page, size) {
    return api.get(`/pessoas/buscar/${page}/${size}`);
  },
  findPessoasByEquipe(equipe, page, size) {
    return api.get(`/pessoas/buscar-por-equipe/${equipe}/${page}/${size}`);
  },
  findPessoaByEmail(email) {
    const emailDto = {
      email,
    };
    return api.post('/pessoas/buscar-por-email/', emailDto);
  },
  findPessoaByKeyword(keyword) {
    return api.get(`/pessoas/busca/${keyword}`);
  },
  findPessoaByPageableKeyword(keyword, group, page, size) {
    group = group != undefined && group > 0 ? group : '';
    return api.get(`/pessoas/busca/${keyword}/${page}/${size}?equipe=${group}`);
  },
  /* EQUIPES */
  findAllEquipes() {
    return api.get('/equipes');
  },
  findEquipesByKeyword(keyword, page, size) {
    return api.get(`/equipes/buscar/${keyword}/${page}/${size}`);
  },
  findEquipes(page, size) {
    return api.get(`/equipes/buscar/${page}/${size}`);
  },
  findEquipeById(id) {
    return api.get(`/equipes/buscar/${id}`);
  },
  /* TRANSAÇÕES */
  efetuarTransacao(transacao) {
    return api.post('/transacoes/nova-transacao', transacao);
  },
  buscarDetalhesTransacoes(id) {
    return api.get(`/transacoes/infos/${id}`);
  },
  buscarEnvios(id, page, size) {
    return api.get(`/transacoes/envios/${id}/${page}/${size}`);
  },
  buscarRecebidos(id, page, size) {
    return api.get(`/transacoes/recebidos/${id}/${page}/${size}`);
  },
  /* USUÁRIO */
  atualizarCadastro(pessoa) {
    return api.put('/pessoas/alterar', pessoa);
  },
  login(login) {
    const credentials = {
      email: login.email,
      senha: login.password,
    };
    return api.post('/login', credentials);
  },
  getUsuario() {
    return api.get('/auth/get-usuario').catch(control);
  },
  validateToken() {
    return api.get('/auth/is-valid-token').catch(control);
  },
  getEmailByHash(hash) {
    return api.get(`/auth/find-email-by-hash/${hash}`);
  },
  changePasswordByHash(hash, senha) {
    const trocaSenha = {
      hash,
      newPassword: senha,
    };
    return api.post('/auth/change-password-by-hash', trocaSenha);
  },
  trocarSenha(senhaAntiga, novaSenha) {
    const trocaSenha = {
      senhaAntiga,
      novaSenha,
    };
    return api.post('/auth/change-password-by-oldpassword', trocaSenha);
  },
  trocarFoto(file) {
    return api.post('/pessoas/trocar-foto', file);
  },
  forgotPassword(email) {
    return api.post('/auth/forgot/', email);
  },
};
