<template lang="">
  <div style="margin-top: 10px">
    <div style="margin-bottom: 10px">
      <v-sheet
        elevation="10"
        class="py-4 px-1"
      >
        <v-chip-group
          active-class="primary--text"
          mandatory
        >
          <v-chip
            text-color="white"
            v-for="tag in listFilter"
            :color="genColor(tag)"
            :key="tag"
              @click="handleFilter(tag)"
          >
            {{ getTag(tag) }}
          </v-chip>
        </v-chip-group>
      </v-sheet>

    </div>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="500">
          <v-calendar
            ref="calendar"
            v-model="value"
            color="primary"
            type="week"
            :events="events"
            :event-ripple="false"
            :start="getStartDate"
            @change="getEvents"
            @mousedown:event="startDrag"
            @mousedown:time="startTime"
            @mousemove:time="mouseMove"
            @mouseup:time="endDrag"
            @mouseleave.native="cancelDrag"
          >
            <template v-slot:event="{ event, timed, eventSummary }">
              <div
                class="v-event-draggable"
                v-html="eventSummary()"
              >
              </div>
            </template>
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { convertDateTime } from "../utils/helper";
import { ref, reactive, computed } from "@nuxtjs/composition-api";

export default {
  props: {
    doctor_id: [Number, String],
    doctor: {
      type: [Array, Object],
      default: function () {
        return [];
      },
    },
  },

  setup(props: any) {
    const colorChip = ref("default");
    const valueFilter = ref("");
    const value = ref("");
    const listFilter = reactive(["all", "pending", "approved", "passed"]);
    const appointment_id_dragging = ref(0);
    let events: any = ref([]);
    const dragEvent: any = ref(null);
    const dragStart: any = ref(null);
    const dragTime: any = ref(null);
    const createEvent: any = ref(null);
    const createStart: any = ref(null);
    const extendOriginal: any = ref(null);

    const getStartDate = computed(() => {
      let minDate: any = null;
      if (
        props.doctor.appoitment_calendar != null &&
        props.doctor.appoitment_calendar != undefined
      ) {
        props.doctor.appoitment_calendar.forEach((appoitment: any) => {
          const currentDate = new Date(appoitment.start_time);
          if (minDate != null) {
            if (minDate > currentDate) {
              minDate = currentDate;
            }
          } else {
            minDate = currentDate;
          }
        });
        minDate =
          minDate.getFullYear() +
          "-" +
          minDate.getMonth() +
          1 +
          "-" +
          minDate.getDate();
      }
      return minDate;
    });

    const getTag = (tag: string) => {
      return tag.charAt(0).toUpperCase() + tag.slice(1);
    };

    const genColor = (tag: string) => {
      if (tag === "approved") return "green";
      else if (tag === "pending") return "pink";
      else if (tag === "passed") return "grey";
    };

    const startDrag = ({ event, timed }: any): void => {
      appointment_id_dragging.value = event.id;
      if (event && timed) {
        dragEvent.value = event;
        dragTime.value = null;
        extendOriginal.value = null;
      }
    };

    const toTime = (tms: any) => {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    };

    const startTime = (tms: any): void => {
      const mouse = toTime(tms);

      if (dragEvent.value && dragTime.value === null) {
        const start = dragEvent.value.start;
        dragTime.value = mouse - start;
      }
    };

    const roundTime = (time: any, down = true) => {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    };

    const mouseMove = (tms: any): void => {
      const mouse = toTime(tms);
      if (dragEvent.value && dragTime.value !== null) {
        const start = dragEvent.value.start;
        const end = dragEvent.value.end;
        const duration = end - start;
        const newStartTime = mouse - dragTime.value;
        const newStart = roundTime(newStartTime);
        const newEnd = newStart + duration;
        const convertNewStart = new Date(newStart);
        const _convertNewStart = convertDateTime(convertNewStart);
        const convertNewEnd = new Date(newEnd);
        const _convertNewEnd = convertDateTime(convertNewEnd);

        if (
          props.doctor.appoitment_calendar != null &&
          props.doctor.appoitment_calendar != undefined
        ) {
          props.doctor.appoitment_calendar.forEach((item: any) => {
            if (item.appointment_id == appointment_id_dragging.value) {
              item.start_time = _convertNewStart;
              item.end_time = _convertNewEnd;
            }
          });
        }
        dragEvent.value.start = newStart;
        dragEvent.value.end = newEnd;
      }
    };

    const endDrag = (): void => {
      dragTime.value = null;
      dragEvent.value = null;
      createEvent.value = null;
      createStart.value = null;
      extendOriginal.value = null;
      if (
        props.doctor.appoitment_calendar != null &&
        props.doctor.appoitment_calendar != undefined
      ) {
        const doctors_list = localStorage.getItem("doctors");
        if (doctors_list != null && doctors_list != undefined) {
          const _doctor_list = JSON.parse(doctors_list);
          _doctor_list.forEach((item: any) => {
            if (item.doctor_id === props.doctor.doctor_id) {
              item.appoitment_calendar = [];
              item.appoitment_calendar = [...props.doctor.appoitment_calendar];
            }
          });
          localStorage.setItem("doctors", JSON.stringify(_doctor_list));
        }
      }
      appointment_id_dragging.value = 0;
    };

    const cancelDrag = (): void => {
      if (createEvent.value) {
        if (extendOriginal.value) {
          createEvent.value.end = extendOriginal.value;
        } else {
          const i = events.value.indexOf(createEvent.value);
          if (i !== -1) {
            events.value.splice(i, 1);
          }
        }
      }
      createEvent.value = null;
      createStart.value = null;
      dragTime.value = null;
      dragEvent.value = null;
    };

    const getEvents = (): void => {
      const currentEvents = [];
      if (
        props.doctor.appoitment_calendar != null &&
        props.doctor.appoitment_calendar != undefined
      ) {
        for (let i = 0; i < props.doctor.appoitment_calendar.length; i++) {
          const item = props.doctor.appoitment_calendar[i];
          if (
            (valueFilter.value != "" && item.status === valueFilter.value) ||
            valueFilter.value == ""
          ) {
            const timed = true;
            currentEvents.push({
              name: item.requester,
              color: item.color_code,
              start: Date.parse(item.start_time),
              end: Date.parse(item.end_time),
              timed,
              id: item.appointment_id,
            });
          }
        }
        events.value = currentEvents;
      }
    };

    const handleFilter = (value: string): void => {
      if (value == "all") {
        value = "";
      }
      valueFilter.value = value;
      getEvents();
    };

    return {
      colorChip,
      valueFilter,
      value,
      listFilter,
      appointment_id_dragging,
      events,
      dragEvent,
      dragStart,
      dragTime,
      createEvent,
      createStart,
      extendOriginal,
      getStartDate,
      getTag,
      genColor,
      startDrag,
      startTime,
      mouseMove,
      endDrag,
      cancelDrag,
      getEvents,
      handleFilter,
    };
  },
};
</script>
<style lang="">
</style>
