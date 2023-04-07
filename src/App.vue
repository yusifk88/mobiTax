<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
<style>
ion-header{
  box-shadow: none;
  border: none;
}

ion-card{
  box-shadow: none;
  border-radius: 15px;
}
</style>