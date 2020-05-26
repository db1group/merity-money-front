<template>
  <div>
    <v-container>
      <v-row>
        <v-icon>{{icone}}</v-icon>
        <h2>&nbsp {{titulo}}</h2>
      </v-row>
    </v-container>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  props: {
    icone: "",
    titulo: ""
  }
};
</script>
