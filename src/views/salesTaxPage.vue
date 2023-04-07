<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border custom">
      <ion-toolbar>
        <ion-buttons slot="start" @click="isOpen=false">
          <ion-back-button default-href="/" text="Home"></ion-back-button>
        </ion-buttons>
        <ion-title>Sales taxes calculator</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">

      <ion-card v-if="!selectedTax">
        <ion-card-content class="ion-text-center text-muted">
          <ion-icon :icon="warningOutline" size="large" style="font-size: 45px;color: lightgrey;"></ion-icon>
          <h1 style="font-weight: lighter; font-size: 50px; color: lightgrey;">Select a tax to calculate</h1>
        </ion-card-content>
      </ion-card>
      <ion-card v-else>
        <ion-card-content>


        </ion-card-content>
      </ion-card>

      <ion-modal
          :backdrop-breakpoint="0.5"
          :backdrop-dismiss="false"
          :breakpoints="[0.2,0.25, 0.5, 0.6]"
          :initial-breakpoint="0.2"
          :is-open="isOpen"
      >
        <ion-content class="ion-padding">
          <ion-list v-if="taxes.length">
            <ion-item
                v-for="tax in taxes"
                :key="tax.id">

              <ion-icon v-if="selectedTax && selectedTax.id===tax.id"
                        slot="start"
                        :icon="checkmarkCircleOutline"
                        color="success"
                        size="large"
                        style="transition: 0.3s ease-in-out">
              </ion-icon>
              <ion-icon v-else slot="start" :icon="beakerOutline">
              </ion-icon>

              <ion-label style="transition: 0.3s ease-in-out">
                <h2>{{ tax.name }}({{ tax.rate }}%)</h2>
                <p v-if="tax.type.toLowerCase()==='flat'">Flat Rate</p>
                <p v-if="tax.type.toLowerCase()==='compound'">
                  Includes: <span v-for="subtax in tax.sub_tax" :key="subtax.id">
                    {{ subtax.name }}({{ subtax.rate }}%)
                  </span>

                </p>
              </ion-label>
            </ion-item>

          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonModal,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonCard,
  IonCardContent
} from "@ionic/vue";
import {balloonOutline, beakerOutline, warningOutline, checkmarkCircleOutline} from "ionicons/icons";
import store from "@/store/index.js";
import axios from "axios";

export default {
  name: "salesTaxPage",
  components: {
    IonIcon,
    IonList,
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonModal,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent
  },
  data() {
    return {
      isOpen: true,
      taxes: [],
      balloonOutline,
      beakerOutline,
      warningOutline,
      checkmarkCircleOutline,
      selectedTax: null
    }
  },
  computed: {
    countryCode() {
      return store.state.myCountry;
    }
  },
  methods: {
    getTaxes() {
      axios.get("/country/" + this.countryCode + "/taxes")
          .then(res => {
            this.taxes = res.data.data;
            if (this.taxes.length) {
              this.selectedTax = this.taxes[0];
            }
          })
    }
  },
  mounted() {
    this.getTaxes();
  }
}
</script>

<style>

ion-item.selected {
  background-color: #3880ff !important;

}

</style>