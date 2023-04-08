<template>
  <ion-page>
    <ion-header class="ion-no-border custom">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Calculate Salary</ion-title>
        <ion-buttons slot="end">

          <ion-button fill="clear" id="payroll-country-modal">
            <flag :iso="countryCode" style="margin-right: 4px"/>   {{countryCode}}<ion-icon :icon="chevronDown"></ion-icon>
          </ion-button>

          <ion-modal ref="payrollcountryModal" :breakpoints="[0, 0.25, 0.3]" :initial-breakpoint="0.25" trigger="payroll-country-modal">

            <ion-content class="ion-padding">
              <ion-list>
                <ion-item v-for="country in suportedCountries" :key="country.code" @click="countryCode=country.code; $refs.payrollcountryModal.dismiss(null, 'cancel')">
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

        </ion-buttons>

      </ion-toolbar>
    </ion-header>
  <g-h-payslip v-if="countryCode==='GH'"></g-h-payslip>
  </ion-page>
</template>

<script>
import {chevronDown} from "ionicons/icons";
import {IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,IonButton,IonIcon} from "@ionic/vue";
import CountrySelector from "@/components/CountrySelector.vue";
import store from "@/store/index.js";
import GHPayslip from "@/components/GHPayslip.vue";

export default {
  name: "payrollPage",
  components: {
    GHPayslip,
    CountrySelector, IonToolbar, IonHeader, IonPage, IonContent, IonTitle, IonButtons, IonBackButton,IonButton,IonIcon},
  data(){
    return{
      countryCode:"GH",
      chevronDown
    }
  },
  computed: {
    suportedCountries() {
      const accepted = ['GH', 'SL', 'KE'];

      return store.state.countries.filter(country=>accepted.includes(country.code));

    }
  }
}
</script>

<style scoped>

</style>