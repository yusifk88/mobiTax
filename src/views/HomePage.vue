<template>
  <ion-page>
    <ion-header class="ion-no-border custom" :translucent="true">
      <ion-toolbar>
        <ion-title>MobiTax</ion-title>
        <ion-buttons slot="end" >
          <country-selector ></country-selector>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-img style=" height: 250px; z-index: 9999!important; position: absolute; left: 20%;" src="https://built-storage.ams3.cdn.digitaloceanspaces.com/Built%2Fpreviewed_1.png"></ion-img>


      <ion-card color="success" class="ion-text-center ion-no-margin" style="height: 300px; margin-top: 100px; z-index: 99!important; margin-bottom: 40px; border-top-left-radius: 50%;border-top-right-radius: 50%;">


          <h1 style="color: #ffffff; margin-top: 130px">Get Built Accounting</h1>
        <p>Simple accounting on the go!</p>
        <a>
          <img height="80" src="https://built-storage.ams3.cdn.digitaloceanspaces.com/Built%2Fapple_appstore.png">
        </a>

      </ion-card>


      <ion-card color="primary" class="ion-margin-top" @click="$router.push('/vat')">
        <ion-card-content>
          <ion-row>
            <ion-col size="3">
              <div style="background-color: rgba(255,255,255,0.22); border-radius: 15px" class="ion-text-center">

                <ion-icon class="ion-margin" size="large" :icon="calculatorOutline"></ion-icon>

              </div>
            </ion-col>
            <ion-col size="7">
          <h1>Sales Taxes</h1>
          <p>Calculate sales taxes</p>
          </ion-col>
            <ion-col size="2">
              <ion-icon :icon="chevronForward" size="large" class="ion-margin"></ion-icon>
            </ion-col>
          </ion-row>

        </ion-card-content>
      </ion-card>



      <ion-card color="warning">
        <ion-card-content>
          <ion-row>
            <ion-col size="3">
              <div style="background-color: rgba(255,255,255,0.22); border-radius: 15px" class="ion-text-center">

                <ion-icon class="ion-margin" size="large" :icon="speedometerOutline"></ion-icon>

              </div>
            </ion-col>
            <ion-col size="7">
          <h1>Payroll</h1>
          <p>Calculate net pay</p>
          </ion-col>
            <ion-col size="2">
              <ion-icon :icon="chevronForward" size="large" class="ion-margin"></ion-icon>
            </ion-col>
          </ion-row>

        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
    IonText,
} from '@ionic/vue';
import MessageListItem from '@/components/MessageListItem.vue';
import {chevronForward,calculatorOutline,speedometerOutline} from "ionicons/icons";
import { getMessages, Message } from '@/data/messages';
import { ref } from 'vue';
import CountrySelector from "@/components/CountrySelector.vue";

const messages = ref<Message[]>(getMessages());

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
};
</script>
