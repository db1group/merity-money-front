<template>
  <v-container height="100vh">
    <v-layout justify-center wrap>
      <v-progress-circular :size="70" :width="7" color="#833232" indeterminate></v-progress-circular>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Loading',
};
</script>

<style>
</style>
