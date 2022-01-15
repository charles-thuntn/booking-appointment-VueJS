<template lang="">
  <div style="margin-top: 10px">
    <v-row>
      <v-col cols="3" v-for="(doctor, index) in listDoctors" :key="index">
        <v-card
            class="mx-auto"
            max-width="344"
            outlined
          >
            <v-list-item>
              <v-list-item-content>
                <!-- <v-list-item-avatar>
                  <v-avatar>
                    <img
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                      alt="doctor"
                    />
                  </v-avatar>
                </v-list-item-avatar> -->
                <v-list-item-avatar
                  tile
                  size="80"
                  style="margin-bottom: 16px"
                >
                  <img
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                      alt="doctor"
                    />
                </v-list-item-avatar>
                <v-list-item-title class="mb-1">
                  {{doctor.doctor_name}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-card-actions>
              <v-btn
                outlined
                rounded
                text
              >
                <NuxtLink :to="`calendar?doctor_id=${doctor.doctor_id}`">
                  <li>Xem thông tin</li>
                </NuxtLink>
              </v-btn>
            </v-card-actions>
          </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    listDoctors: {
      type: [Array, Object],
      default: function () {
        return [];
      },
    },
  },

  setup(props) {},
};
</script>
<style lang="css" scoped>
a {
  text-decoration: none;
  list-style: none;
  color: rgb(24, 216, 206);
}
</style>
