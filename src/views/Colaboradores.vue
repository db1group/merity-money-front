<template>
  <div>
    <PageTitle icone="mdi-account" titulo="Colaboradores"/>
    <Table/>
  </div>
</template>

<script>
import Table from '@/components/Table';
import PageTitle from '@/components/PageTitle';

export default {
  components: {
    Table,
    PageTitle,
  },
};
</script>

<style>
</style>
