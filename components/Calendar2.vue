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

interface Calendar {
  colorChip: string;
  valueFilter: string;
  value: any;
  listFilter: Array<string>;
  appointment_id_dragging: Number;
  events: Array<Object>;
  dragEvent: any;
  dragStart: any;
  dragTime: any;
  createEvent: any;
  createStart: any;
  extendOriginal: any;
}

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
  data: (): Calendar => ({
    colorChip: "default",
    valueFilter: "",
    value: "",
    listFilter: ["all", "pending", "approved", "passed"],
    appointment_id_dragging: 0,
    events: [],
    dragEvent: null,
    dragStart: null,
    dragTime: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
  }),

  computed: {
    getStartDate() {
      const self: any = this;
      let minDate: any = null;
      if (
        self.doctor.appoitment_calendar != null &&
        self.doctor.appoitment_calendar != undefined
      ) {
        self.doctor.appoitment_calendar.forEach((appoitment: any) => {
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
      const self: any = this;
      self.appointment_id_dragging = event.id;
      if (event && timed) {
        self.dragEvent = event;
        self.dragTime = null;
        self.extendOriginal = null;
      }
    },
    startTime(tms: any): void {
      const self: any = this;
      const mouse = self.toTime(tms);

      if (self.dragEvent && self.dragTime === null) {
        const start = self.dragEvent.start;

        self.dragTime = mouse - start;
      }
    },
    mouseMove(tms: any): void {
      const self: any = this;
      const mouse = self.toTime(tms);
      if (self.dragEvent && self.dragTime !== null) {
        const start = self.dragEvent.start;
        const end = self.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - self.dragTime;
        const newStart = self.roundTime(newStartTime);
        const newEnd = newStart + duration;
        const convertNewStart = new Date(newStart);
        const _convertNewStart = convertDateTime(convertNewStart);
        const convertNewEnd = new Date(newEnd);
        const _convertNewEnd = convertDateTime(convertNewEnd);

        if (
          self.doctor.appoitment_calendar != null &&
          self.doctor.appoitment_calendar != undefined
        ) {
          self.doctor.appoitment_calendar.forEach((item: any) => {
            if (item.appointment_id == self.appointment_id_dragging) {
              item.start_time = _convertNewStart;
              item.end_time = _convertNewEnd;
              console.log(item);
            }
          });
        }
        self.dragEvent.start = newStart;
        self.dragEvent.end = newEnd;
      }
    },
    endDrag(): void {
      const self: any = this;
      self.dragTime = null;
      self.dragEvent = null;
      self.createEvent = null;
      self.createStart = null;
      self.extendOriginal = null;
      if (
        self.doctor.appoitment_calendar != null &&
        self.doctor.appoitment_calendar != undefined
      ) {
        const doctors_list = localStorage.getItem("doctors");
        if (doctors_list != null && doctors_list != undefined) {
          const _doctor_list = JSON.parse(doctors_list);
          _doctor_list.forEach((item: any) => {
            if (item.doctor_id === self.doctor.doctor_id) {
              item.appoitment_calendar = [];
              item.appoitment_calendar = [...self.doctor.appoitment_calendar];
            }
          });
          localStorage.setItem("doctors", JSON.stringify(_doctor_list));
        }
      }
      self.appointment_id_dragging = 0;
    },
    cancelDrag(): void {
      const self: any = this;
      if (self.createEvent) {
        if (self.extendOriginal) {
          self.createEvent.end = self.extendOriginal;
        } else {
          const i = self.events.indexOf(self.createEvent);
          if (i !== -1) {
            self.events.splice(i, 1);
          }
        }
      }
      self.createEvent = null;
      self.createStart = null;
      self.dragTime = null;
      self.dragEvent = null;
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
      const self: any = this;
      const events = [];
      if (
        self.doctor.appoitment_calendar != null &&
        self.doctor.appoitment_calendar != undefined
      ) {
        for (let i = 0; i < self.doctor.appoitment_calendar.length; i++) {
          const item = self.doctor.appoitment_calendar[i];
          if (
            (self.valueFilter != "" && item.status === self.valueFilter) ||
            self.valueFilter == ""
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
        self.events = events;
      }
    },

    handleFilter(value: string): void {
      const self: any = this;
      if (value == "all") {
        value = "";
      }
      self.valueFilter = value;
      self.getEvents();
    },
  },
};
</script>
<style lang="">
</style>
