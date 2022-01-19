<template lang="">
  <div>
      <Header :title="`Lịch khám`" :screen="screen"/>
      <!-- <Calendar
        v-if="response != null
          && response.length > 0"
        data="response" /> -->
      <Calendar :doctor="doctor" :doctor_id="doctor_id"/>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Context } from "@nuxt/types";
import { computed, reactive, ref } from "@vue/composition-api";

export default {
  async asyncData({ query }: any) {
    const { doctor_id } = query;
    let dataStorage = [];
    const _data = localStorage.getItem("doctors");
    if (_data != null && _data != undefined) {
      dataStorage = JSON.parse(_data);
    }
    // const response = await axios
    //   .get(
    //     `https://my-json-server.typicode.com/pqcuong737/jsonfakeserver/data?doctor_id=${doctor_id}`
    //   )
    //   .then((res) => {
    //     return res.data;
    //   });
    // );
    let doctor = dataStorage[doctor_id - 1];
    return { doctor_id, doctor };
  },

  setup(props: any) {
    const screen = ref("DETAIL");
    const date = computed(() => {
      const today = new Date();
      const _today =
        today.getDate() +
        "/" +
        today.getMonth() +
        1 +
        "/" +
        today.getFullYear();
      return _today;
    });

    return { date, screen };
  },
};
</script>
<style lang="">
</style>
