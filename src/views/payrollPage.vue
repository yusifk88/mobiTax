<template>
  <ion-page>
    <ion-header class="ion-no-border custom">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Calculate Salary</ion-title>
        <ion-buttons slot="end">

          <ion-button @click="isOpen=true" fill="clear">
            <flag :iso="countryCode" style="margin-right: 4px"/>
            {{ countryCode }}
            <ion-icon :icon="chevronDown"></ion-icon>
          </ion-button>


        </ion-buttons>

      </ion-toolbar>
    </ion-header>

    <ion-modal @did-dismiss="isOpen=false" :is-open="isOpen" :breakpoints="[0, 0.25, 0.3]" :initial-breakpoint="0.25"
               trigger="payroll-country-modal">

      <ion-content class="ion-padding">
        <ion-list>
          <ion-item
              style="border-radius: 15px"
              :color="country.code== countryCode ? 'success' : ''"
              v-for="country in suportedCountries" :key="country.code"
              @click="countryCode=country.code; $refs.payrollcountryModal.dismiss(null, 'cancel')">
            <ion-label>
              <h2>
                <flag :iso="country.code" style="margin-right: 4px"/>
                {{ country.name }}({{ country.code }})
              </h2>
            </ion-label>
            <ion-icon size="large" style="transition: 0.2s ease-in-out" v-if="country.code== countryCode"  slot="end" :icon="checkmarkCircleOutline"></ion-icon>

          </ion-item>

        </ion-list>
      </ion-content>
    </ion-modal>

    <g-h-payslip v-if="countryCode==='GH'"></g-h-payslip>
    <k-e-payroll v-if="countryCode==='KE'"></k-e-payroll>
    <s-l-payroll v-if="countryCode==='SL'"></s-l-payroll>
  </ion-page>
</template>

<script>
import {chevronDown,checkmarkCircleOutline} from "ionicons/icons";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon
} from "@ionic/vue";
import CountrySelector from "@/components/CountrySelector.vue";
import store from "@/store/index.js";
import GHPayslip from "@/components/GHPayslip.vue";
import KEPayroll from "@/components/KEPayroll.vue";
import SLPayroll from "@/components/SLPayroll.vue";

export default {
  name: "payrollPage",
  components: {
    SLPayroll,
    KEPayroll,
    GHPayslip,
    CountrySelector, IonToolbar, IonHeader, IonPage, IonContent, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon
  },
  data() {
    return {
      isOpen:false,
      countryCode: "GH",
      chevronDown,
      accepted: ['GH', 'SL', 'KE'],
      checkmarkCircleOutline
    }
  },
  computed: {
    suportedCountries() {
      return store.state.countries.filter(country => this.accepted.includes(country.code));

    },
    myCountry() {
      return store.state.myCountry;
    }
  },
  mounted() {

    if (this.accepted.includes(this.myCountry)) {
      this.countryCode = this.myCountry;

    }

  }
}
</script>

<style scoped>

</style>