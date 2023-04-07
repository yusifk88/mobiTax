<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border custom">
      <ion-toolbar>
        <ion-buttons slot="start" @click="isOpen=false">
          <ion-back-button default-href="/" text="Home"></ion-back-button>
        </ion-buttons>
        <ion-title>Sales taxes calculator</ion-title>
        <ion-buttons slot="end">
          <country-selector></country-selector>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">

      <ion-card v-show="!defaultTax">
        <ion-card-content class="ion-text-center text-muted">
          <ion-icon :icon="warningOutline" size="large" style="font-size: 45px;color: lightgrey;"></ion-icon>
          <h1 style="font-weight: lighter; font-size: 50px; color: lightgrey;">Select a tax to calculate</h1>
        </ion-card-content>
      </ion-card>


      <span v-show="defaultTax">

        <ion-card>
          <ion-card-content class="ion-no-padding">
            <input id="amount-input" v-model="amount" class="number-input" placeholder="0.00" type="number">
          </ion-card-content>
        </ion-card>
      <ion-card>
        <ion-card-content v-if="defaultTax" class="ion-no-padding">
          <h1 v-if="defaultTax && defaultTax.type=='Flat'"
              style="font-weight: lighter; font-size: 25px; border-bottom: 1px solid grey">{{
              defaultTax ? defaultTax.name : ""
            }}
            ({{ defaultTax ? defaultTax.rate : "" }}%):</h1>

          <span v-if="defaultTax.type='Compound'">

            <p v-for="subtax in defaultTax.sub_tax" :key="subtax.id" class="ion-padding"
               style="font-size: 20px; font-weight: lighter;">

              {{ subtax.name }}({{ subtax.rate }}%):{{ subtax.amount ? subtax.amount : 0 }}

            </p>

  <p style="font-weight: lighter; font-size: 25px; border-bottom: 1px solid">{{
      defaultTax ? defaultTax.name : ""
    }}
            ({{ defaultTax ? defaultTax.rate : "" }}%):{{ defaultTax.amount ? defaultTax.amount : 0 }}</p>



  <p style="font-weight: lighter; font-size: 35px; border-bottom: 1px double; margin-top: 30px">Total Tax:{{
      formatedTotalAmount
    }}</p>



 </span>

        </ion-card-content>
      </ion-card>
      </span>

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
                :key="tax.id"
                v-on:click="selectTax(tax)"
            >
              <ion-icon slot="start" :icon="beakerOutline">
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
  IonCardContent,
  IonText
} from "@ionic/vue";
import {balloonOutline, beakerOutline, warningOutline, checkmarkCircleOutline} from "ionicons/icons";
import store from "@/store/index.js";
import axios from "axios";
import {defineComponent} from "vue";
import CountrySelector from "@/components/CountrySelector.vue";

export default defineComponent({
  name: "salesTaxPage",
  components: {
    IonText,
    CountrySelector,
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
      defaultTax: null,
      totalTax: 0,
      amount: 0
    }
  },
  computed: {
    countryCode() {
      return store.state.myCountry;
    },
    selectedTax() {
      return store.state.selectedTax;
    },
    formatedTotalAmount() {

      return Intl.NumberFormat('en-US').format(this.totalTax);
    }
  },

  watch: {
    amount() {
      if (this.defaultTax) {

        const maintaxAmount = (this.defaultTax.rate / 100) * Number(this.amount)
        this.totalTax = maintaxAmount;

        this.defaultTax.amount = this.formatAmount(maintaxAmount);

        const compoundAmount = maintaxAmount + this.amount;

        if (this.defaultTax.sub_tax) {
          for (let i = 0; i < this.defaultTax.sub_tax.length; i++) {

            const taxAmount = (Number(this.defaultTax.sub_tax[i].rate) / 100) * compoundAmount;

            this.totalTax += taxAmount;

            this.defaultTax.sub_tax[i].amount = this.formatAmount(taxAmount);

          }
        }


      }


    }
  },
  methods: {

    formatAmount(amount) {

      return Intl.NumberFormat('en-US').format(amount);

    },
    selectTax(tax) {

      this.defaultTax = JSON.parse(JSON.stringify(tax));
      this.amount = 0;
      this.totalTax = 0;
      document.getElementById("amount-input").focus();

    },
    getTaxes() {
      axios.get("/country/" + this.countryCode + "/taxes")
          .then(res => {

            const newTaxes = res.data.data;

            this.taxes = newTaxes;

            // if (newTaxes.length) {
            //   store.state.selectedTax =newTaxes[0];
            // }

          })
    }
  },
  mounted() {
    this.getTaxes();
  }
});
</script>

<style>
.number-input {
  width: 100%;
  height: 70px;
  font-size: 35px;
  font-weight: lighter;
  border: none;
  text-align: center;
  background-color: #CCCCCC2F;
  border-radius: 15px;
}

.number-input:focus {

  border: none;
  outline: none;

}

ion-item.selected {
  background-color: #3880ff !important;

}

</style>