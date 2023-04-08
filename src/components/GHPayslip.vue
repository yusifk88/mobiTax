<template>
  <ion-content :fullscreen="true" class="ion-padding" style="transition: 0.3s ease-in-out">

    <ion-item v-if="date" style="border: 1px solid lightgrey">

      Payroll Date:
      <ion-datetime-button class="ion-margin-start" datetime="datetime"></ion-datetime-button>

      <ion-modal

          :keep-contents-mounted="true"
      >

        <ion-datetime id="datetime" :show-default-buttons="true" :value="date" presentation="date"
                      @ionChange="dateChanged">
          <span slot="title">Select payroll Date</span>

        </ion-datetime>

      </ion-modal>


    </ion-item>
    <small class="ion-margin ion-text-center text-muted" style="display: block">Due to periodic changes to payroll, we
      use the date to navigate changes to how payroll works as time goes on.</small>

    <ion-item class="ion-margin-top" lines="none">
      <input v-model="basic_salary" class="mobitax-input" placeholder="Basic Salary" type="number">

    </ion-item>


    <ion-item class="ion-margin-top" lines="none">
      <input v-model="allowance" class="mobitax-input" placeholder="Allowance" type="number">

    </ion-item>

    <ion-item class="ion-margin-top" lines="none">
      <input v-model="bonus" class="mobitax-input" placeholder="Bonus" type="number">

    </ion-item>


    <ion-item class="ion-margin-top" lines="none">
      <input v-model="reimbursement" class="mobitax-input" placeholder="Reimbursement" type="number">

    </ion-item>


    <ion-item class="ion-margin-top" lines="none">
      <ion-toggle :checked="isResident" mode="ios" @ionChange="residentToggleChanged">Resident</ion-toggle>
    </ion-item>

    <ion-item class="ion-margin-top" lines="none">
      <ion-toggle :checked="deductPension" mode="ios" @ionChange="pensionToggleChanged">Deduct Pension</ion-toggle>
    </ion-item>

    <ion-item class="ion-margin-top" lines="none">
      <ion-toggle :checked="deductIncomeTax" mode="ios" @ionChange="taxToggleChanged">Deduct Income Tax</ion-toggle>
    </ion-item>

    <ion-button :disabled="!inputIsValid" color="primary" expand="block" mode="ios" shape="round" size="large"
                style="bottom: 0; position: fixed; width: 90%"
                @click="calculcate">Calculate
    </ion-button>

    <ion-modal ref="modal" :is-open="showPayslip" trigger="open-modal">
      <ion-header class="ion-no-border custom">
        <ion-toolbar>
          <ion-title>Payslip</ion-title>
          <ion-buttons slot="end">
            <ion-button color="danger" @click="showPayslip=false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding" v-if="payslip">
       <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
         Basic Salary:{{formatAmount(payslip.basic_pay)}}
       </p>
  <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
    Taxable Income:{{formatAmount(payslip.taxable_income)}}
       </p>

        <p class="ion-margin-start text-muted" style="font-weight: 18px; font-style: italic;">Earnings</p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Allowance:{{formatAmount(payslip.allowance)}}
        </p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Bonus: {{formatAmount(payslip.bonus)}}
        </p>
        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Reimbursement:{{formatAmount(payslip.reimbursement)}}
        </p>

        <ion-text color="primary">

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter;border-bottom: 1px solid #3880ff">
          Gross Salary:{{formatAmount(payslip.gross_pay)}}
        </p>
        </ion-text>

        <p class="text-muted ion-margin-start" style="font-weight: 18px; font-style: italic;">Deductions</p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Bonus Tax:{{formatAmount(payslip.bonus_tax)}}
        </p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          P.A.Y.E: {{formatAmount(payslip.paye)}}
        </p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          SSNIT: {{formatAmount(payslip.ssnit)}}
        </p>

        <ion-text color="danger">
        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter; border-bottom: 1px solid #eb445a">
          Total Deductions:{{formatAmount(payslip.total_deductions)}}
        </p>
        </ion-text>


        <ion-text color="success">
        <p class="ion-margin-start" style="font-size: 32px; font-weight: lighter; border-bottom: 1px double #2dd36f">
          Net Pay: {{formatAmount(payslip.net_pay)}}
        </p>
        </ion-text>



      </ion-content>


    </ion-modal>


  </ion-content>
</template>

<script>
import {closeOutline} from "ionicons/icons";
import {IonButton, IonContent, IonDatetime, IonDatetimeButton, IonItem, IonLabel, IonToggle, IonIcon,IonText} from "@ionic/vue";
import axios from "axios";

export default {
  props: {
    countryCode: {
      default: "GH",
      type: String
    }
  },
  name: "GHPayslip",
  components: {IonContent, IonButton, IonDatetimeButton, IonDatetime, IonItem, IonLabel, IonToggle, IonIcon,IonText},
  data() {
    return {
      basic_salary: null,
      bonus: null,
      allowance: null,
      reimbursement: null,
      isResident: true,
      deductPension: true,
      deductIncomeTax: true,
      date: "",
      payslip: null,
      showPayslip: false,
      closeOutline,
      currencyCode:"GHS"
    }
  },
  computed: {
    inputIsValid() {
      return this.basic_salary > 0;
    }
  },
  methods: {
    formatAmount(amount){
      return this.currencyCode+Intl.NumberFormat('en-US').format(amount);
    },
    dateChanged(newDate) {

      this.date = newDate.detail.value;

    },
    pensionToggleChanged(checked) {
      this.deductPension = checked.detail.checked;

    },
    residentToggleChanged(checked) {
      this.isResident = checked.detail.checked;

    }
    ,
    taxToggleChanged(checked) {
      this.deductIncomeTax = checked.detail.checked;

    },

    calculcate() {

      const data = {
        basic_pay: Number(this.basic_salary),
        bonus: Number(this.bonus),
        allowance: Number(this.allowance),
        status: this.isResident ? "resident" : "nonresident",
        deduct_pension: this.deductPension,
        reimbursement: Number(this.reimbursement),
        deduct_paye: this.deductIncomeTax,
        date: new Date(this.date).toJSON().slice(0, 10)
      }

      const URL = "/payroll/" + this.countryCode.toLowerCase() + "/gross-to-net";

      axios.post(URL, data)
          .then(res => {

            this.showPayslip = true;
            this.payslip = res.data.data;


          })

    }


  },
  mounted() {
    this.date = new Date().toJSON();

  }
}
</script>

<style>
.mobitax-input {
  width: 100%;
  height: 50px;
  font-size: 35px;
  font-weight: lighter;
  border: none;
  text-align: center;
  background-color: #CCCCCC2F;
  border-radius: 15px;
}

.mobitax-input:focus {

  border: none;
  outline: none;

}
</style>