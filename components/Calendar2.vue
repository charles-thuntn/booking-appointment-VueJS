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
  data: () => ({
    colorChip: "default",
    valueFilter: "",
    value: "",
    listFilter: ["all", "pending", "approved", "passed"],
    appointment_id_dragging: 0,
    events: [],
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
  }),

  computed: {
    getStartDate() {
      let minDate: any = null;
      if (
        this.doctor.appoitment_calendar != null &&
        this.doctor.appoitment_calendar != undefined
      ) {
        this.doctor.appoitment_calendar.forEach((appoitment: any) => {
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
    },
  },

  methods: {
    getTag(tag: string) {
      return tag.charAt(0).toUpperCase() + tag.slice(1);
    },
    genColor(tag: string) {
      if (tag === "approved") return "green";
      else if (tag === "pending") return "pink";
      else if (tag === "passed") return "grey";
    },
    startDrag({ event, timed }: any): void {
      this.appointment_id_dragging = event.id;
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    startTime(tms: any): void {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;

        this.dragTime = mouse - start;
      }
    },
    mouseMove(tms: any): void {
      const mouse = this.toTime(tms);
      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;
        const convertNewStart = new Date(newStart);
        const _convertNewStart = convertDateTime(convertNewStart);
        const convertNewEnd = new Date(newEnd);
        const _convertNewEnd = convertDateTime(convertNewEnd);

        if (
          this.doctor.appoitment_calendar != null &&
          this.doctor.appoitment_calendar != undefined
        ) {
          this.doctor.appoitment_calendar.forEach((item: any) => {
            if (item.appointment_id == this.appointment_id_dragging) {
              item.start_time = _convertNewStart;
              item.end_time = _convertNewEnd;
              console.log(item);
            }
          });
        }
        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      }
    },
    endDrag(): void {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
      if (
        this.doctor.appoitment_calendar != null &&
        this.doctor.appoitment_calendar != undefined
      ) {
        const doctors_list = localStorage.getItem("doctors");
        if (doctors_list != null && doctors_list != undefined) {
          const _doctor_list = JSON.parse(doctors_list);
          _doctor_list.forEach((item: any) => {
            if (item.doctor_id === this.doctor.doctor_id) {
              item.appoitment_calendar = [];
              item.appoitment_calendar = [...this.doctor.appoitment_calendar];
            }
          });
          localStorage.setItem("doctors", JSON.stringify(_doctor_list));
        }
      }
      this.appointment_id_dragging = 0;
    },
    cancelDrag(): void {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }
      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time: any, down = true) {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms: any) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },
    getEvents(): void {
      const events = [];
      if (
        this.doctor.appoitment_calendar != null &&
        this.doctor.appoitment_calendar != undefined
      ) {
        for (let i = 0; i < this.doctor.appoitment_calendar.length; i++) {
          const item = this.doctor.appoitment_calendar[i];
          if (
            (this.valueFilter != "" && item.status === this.valueFilter) ||
            this.valueFilter == ""
          ) {
            const timed = true;
            events.push({
              name: item.requester,
              color: item.color_code,
              start: Date.parse(item.start_time),
              end: Date.parse(item.end_time),
              timed,
              id: item.appointment_id,
            });
          }
        }
        this.events = events;
      }
    },

    handleFilter(value: string): void {
      if (value == "all") {
        value = "";
      }
      this.valueFilter = value;
      this.getEvents();
    },
  },
};
</script>
<style lang="">
</style>
