<template lang="">
  <div>
    <Calendar v-if="response != null && response.length > 0 && response[0].appoitment_calendar != null && response[0].appoitment_calendar != undefined" :data="response[0].appoitment_calendar" />
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Context } from "@nuxt/types";

export default {
  async asyncData({ query }: Context) {
    const { doctor_id } = query;
    const response = await axios
      .get(
        `https://my-json-server.typicode.com/pqcuong737/jsonfakeserver/data?doctor_id=${doctor_id}`
      )
      .then((res) => {
        return res.data;
      });

    return { response };
  },
};
</script>
<style lang="">
</style>
