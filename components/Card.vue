<template lang="">
  <div class="wrapper-card" :style="{backgroundColor: person.color_code}">
    <v-card
      class="mx-auto"
      max-width="200"
      outlined
      style="height: 100%"
    >
      <v-list-item three-line>
        <v-list-item-avatar>
          <v-avatar>
            <img
              :src="`${person.avatar}`"
              :alt="`${person.requester}`"
            >
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <div class="mb-4">
            <v-chip
              class="ma-2"
              :color="color"
              text-color="white"
            >
              {{person.status}}
            </v-chip>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <div class="">
          <h3>{{person.requester}}</h3>
          <p>{{person.symptom}}</p>
        </div>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
import { ref } from "@nuxtjs/composition-api";
export default {
  props: {
    person: {
      type: Object,
      default: {},
    },
  },

  setup(props) {
    const color = ref("");

    const genColorStatus = () => {
      if (props.person.status === "approved") color.value = "green";
      else if (props.person.status === "pending") color.value = "pink";
      else if (props.person.status === "passed") color.value = "grey";
    };

    genColorStatus();

    return { color };
  },
};
</script>
<style lang="css">
.wrapper-card {
  min-width: 200px;
  margin-right: 10px;
  padding-left: 7px;
  border-radius: 4px;
}
.color-wrapper-approved {
  background-color: green;
}
.color-wrapper-passed {
  background-color: grey;
}
.color-wrapper-pending {
  background-color: crimson;
}
</style>
