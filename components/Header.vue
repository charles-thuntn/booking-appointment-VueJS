<template lang="">
  <div class="header">
    <v-card
      color="grey lighten-4"
      flat
      tile
    >
      <v-toolbar color="rgb(35 165 183)">
        <v-btn
          v-if="screen == 'DETAIL'"
          @click="$router.push('/')"
          icon
          class="hidden-xs-only"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title style="color: white">{{title}}</v-toolbar-title>
      </v-toolbar>
    </v-card>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    title: String,
    screen: {
      type: String,
      default: "LIST",
    },
  },

  setup(props: any) {},
};
</script>
<style lang="">
</style>
