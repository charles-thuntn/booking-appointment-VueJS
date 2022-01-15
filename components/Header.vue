<template lang="">
  <div class="header">
    <v-card
      color="grey lighten-4"
      flat
      tile
    >
      <v-toolbar color="rgb(35 165 183)">
        <v-toolbar-title style="color: white">{{title}}</v-toolbar-title>
      </v-toolbar>
    </v-card>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    title: String,
  },
};
</script>
<style lang="">
</style>
