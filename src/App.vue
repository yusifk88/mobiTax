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

ion-toolbar{
 height: 60px;

}
ion-searchbar{
  --background: #19422d;
  --color: #fff;
  --placeholder-color: #fff;
  --icon-color: #fff;
  --clear-button-color: #fff;
  --border-radius: 4px;

}
.text-muted{
  color: grey!important;
}

ion-card{
  box-shadow: none;
  border-radius: 15px;
}
</style>