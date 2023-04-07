<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>MobiTax</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-card style="height: 300px">
        <ion-card-content>

          <h1>Show Built Ad here</h1>
        </ion-card-content>
      </ion-card>
      <ion-card color="primary">
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



      <ion-card color="secondary">
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
} from '@ionic/vue';
import MessageListItem from '@/components/MessageListItem.vue';
import {chevronForward,calculatorOutline,speedometerOutline} from "ionicons/icons";
import { getMessages, Message } from '@/data/messages';
import { ref } from 'vue';

const messages = ref<Message[]>(getMessages());

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
};
</script>
