<template>
  <div>
    <Header :title="`Danh sách bác sĩ`" />
    <Doctor :listDoctors="doctors" />
  </div>
</template>

<script lang="ts">
import { defineComponent, useFetch, ref } from "@nuxtjs/composition-api";
import axios from "axios";

export default defineComponent({
  setup() {
    const doctors = ref(null);

    useFetch(async () => {
      doctors.value = await axios
        .get(
          "https://my-json-server.typicode.com/pqcuong737/jsonfakeserver/data"
        )
        .then((res) => {
          return res.data;
        });
    });

    return { doctors };
  },
});
</script>
