<template>
  <ion-button id="country-modal" fill="clare" size="large">
    <flag :iso="myCountry" style="margin-right: 4px"/>
    {{ myCountry }}
    <ion-icon :icon="chevronDown"></ion-icon>
  </ion-button>

  <ion-modal ref="countryModal" :breakpoints="[0, 0.25, 0.5, 0.75,0.8,1]" :initial-breakpoint="0.25" trigger="country-modal">
    <ion-header class="ion-no-border">
      <ion-searchbar :debounce="1000"
                     mode="ios"
                     placeholder="Search country..."
                     @click="$refs.countryModal.$el.setCurrentBreakpoint(0.8)"
                     @ionChange="searchChange($event)"
      ></ion-searchbar>

    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item v-for="country in countries" :key="country.code" @click="selectCountry(country.code)">
          <ion-label>
            <h2>
              <flag :iso="country.code" style="margin-right: 4px"/>
              {{ country.name }}({{ country.code }})
            </h2>
          </ion-label>
        </ion-item>

      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script>

import store from "../store";
import {IonButton, IonIcon, IonModal, IonHeader, IonSearchbar} from '@ionic/vue';
import {chevronDown} from "ionicons/icons";

export default {
  name: "CountrySelector",
  components: {IonButton, IonIcon, IonModal, IonHeader, IonSearchbar},
  data() {
    return {
      chevronDown,
      store,
      search: ""
    }
  },
  computed: {
    myCountry() {
      return store.state.myCountry;
    },
    countries() {
      return store.state.countries;
    }
  },
  methods: {
    searchChange(event) {

      this.search = event.target.value.toLowerCase();

    },
    selectCountry(code) {
      this.store.state.myCountry = code;
      this.$refs.countryModal.$el.dismiss(null, "cancel");
    }
  }

}
</script>

<style scoped>

</style>