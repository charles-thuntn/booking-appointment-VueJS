<template lang="">
  <div class="calendar">
    <Header :title="`Lịch khám ngày ${date}`" />
    <v-timeline
      align-top
      dense
    >
      <v-timeline-item
        fill-dot
        small
        align-top
        class="time"
          v-for="(value, index) in timeLine"
        :key="index"
      >
        <v-row>
          <v-col cols="1">
            {{`${value.timeStart}:00`}}
          </v-col>
          <v-col cols="11">
            <div style="display: flex; justify-content: flex-start">
              <Card v-for="(person, index) in value.persons" :key="index" :person="person"/>
            </div>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>
<script lang="ts">
import { computed, reactive } from "@vue/composition-api";

export default {
  props: {
    data: {
      type: [Array, Object],
      default: function () {
        return [];
      },
    },
  },
  setup(props: any) {
    const timeLine = reactive([
      {
        buoi: "mor",
        timeStart: "6",
        persons: [],
      },
      {
        buoi: "mor",
        timeStart: "7",
        persons: [],
      },
      {
        buoi: "mor",
        timeStart: "8",
        persons: [],
      },
      {
        buoi: "mor",
        timeStart: "9",
        persons: [],
      },
      {
        buoi: "mor",
        timeStart: "10",
        persons: [],
      },
      {
        buoi: "mor",
        timeStart: "11",
        persons: [],
      },
      {
        buoi: "mor",
        timeStart: "12",
        persons: [],
      },
      {
        buoi: "af",
        timeStart: "13",
        persons: [],
      },
      {
        buoi: "af",
        timeStart: "14",
        persons: [],
      },
      {
        buoi: "af",
        timeStart: "15",
        persons: [],
      },
      {
        buoi: "af",
        timeStart: "16",
        persons: [],
      },
      {
        buoi: "af",
        timeStart: "17",
        persons: [],
      },
      {
        buoi: "af",
        timeStart: "18",
        persons: [],
      },
      {
        buoi: "af",
        timeStart: "19",
        persons: [],
      },
      {
        buoi: "af",
        timeStart: "20",
        persons: [],
      },
    ]);

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

    const handleData = () => {
      props.data.forEach((element: any) => {
        const timeBooking = new Date(element.start_time).getHours();
        timeLine.forEach((timeLineItem: any) => {
          if (timeLineItem.timeStart == timeBooking) {
            timeLineItem.persons.push(element);
          }
        });
      });
    };

    handleData();

    return { timeLine, date };
  },
};
</script>
<style lang="css">
.time {
  width: 100% !important;
}
.time .v-timeline-item__opposite {
  align-self: flex-start;
}
</style>
