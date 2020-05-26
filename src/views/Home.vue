<template>
  <div>
    <PageTitle icone="mdi-chart-bar" titulo="Dashboard" />
    <TabelaTransacoes :isEnvios="true" />
    <TabelaTransacoes :isEnvios="false" />
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import TabelaTransacoes from '@/components/TabelaTransacoes';

export default {
  components: {
    PageTitle,
    TabelaTransacoes,
  },
};
</script>

<style>
</style>
