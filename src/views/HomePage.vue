<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>MobiTax</ion-title>
        <ion-buttons slot="end">
          <country-selector></country-selector>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding-top">

      <ad-slider></ad-slider>

      <ion-button @click="$router.push('/vat')" style="height: 100px" mode="ios" class="ion-margin" size="large" color="primary" expand="block">
        <span class="ion-text-center ion-margin-end" style="background-color: rgba(255,255,255,0.22); border-radius: 15px">

          <ion-icon :icon="calculatorOutline" class="ion-margin" size="large"></ion-icon>
        </span>
        Sales Taxes

        <ion-icon :icon="chevronForward" class="ion-margin" size="large"></ion-icon>

      </ion-button>

      <ion-button color="warning" @click="$router.push('/payslip')" style="height: 100px" mode="ios" class="ion-margin" size="large" expand="block">
        <span class="ion-text-center ion-margin-end" style="background-color: rgba(255,255,255,0.22); border-radius: 15px;">

          <ion-icon class="ion-margin" :icon="speedometerOutline" size="large"></ion-icon>

        </span>
        Payroll

        <ion-icon :icon="chevronForward" class="ion-margin" size="large"></ion-icon>

      </ion-button>




    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
    IonIcon
} from '@ionic/vue';

import {chevronForward, calculatorOutline, speedometerOutline} from "ionicons/icons";
import CountrySelector from "@/components/CountrySelector.vue";
import {defineComponent} from "vue";
import AdSlider from "@/components/AdSlider.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    AdSlider,
    IonPage,
    IonContent,
    IonList,
    IonTitle,
    IonToolbar,
    IonText,
    IonHeader,
    CountrySelector,
    IonIcon
  },
  data() {
    return {
      chevronForward, calculatorOutline, speedometerOutline
    }
  },

computed:{
  OS(){
    const win = window;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode;

  },

}
});


</script>
