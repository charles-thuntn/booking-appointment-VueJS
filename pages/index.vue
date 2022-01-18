<template>
  <div>
    <Header :title="`Danh sách bác sĩ`" />
    <Doctor :listDoctors="doctors" />
  </div>
</template>

<script lang="js">
import { defineComponent, useFetch, ref, onMounted } from "@nuxtjs/composition-api";
import axios from "axios";

export default defineComponent({
  setup() {
    const doctors = ref(null);
    if (localStorage.getItem('doctors')) {
      console.log("if");
      doctors.value = JSON.parse(localStorage.getItem('doctors'));
    }
    else {
      console.log("else");
      useFetch(async () => {
        doctors.value = await axios
          .get(
            "https://my-json-server.typicode.com/pqcuong737/jsonfakeserver/data"
          )
          .then((res) => {
            localStorage.setItem('doctors', JSON.stringify(res.data));
            return res.data;
          });
      });
    }
    return { doctors };
  },
});
</script>
