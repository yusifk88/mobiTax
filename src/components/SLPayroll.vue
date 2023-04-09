<template>
  <ion-content :fullscreen="true" class="ion-padding" style="transition: 0.3s ease-in-out">

    <ion-item v-if="date" style="border: 1px solid lightgrey;border-radius: 10px;">

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
      <ion-toggle :checked="deductPension" mode="ios" @ionChange="pensionToggleChanged">Deduct NASSIT:</ion-toggle>
    </ion-item>

    <ion-item class="ion-margin-top" lines="none">
      <ion-toggle :checked="deductIncomeTax" mode="ios" @ionChange="taxToggleChanged">Deduct Income Tax</ion-toggle>
    </ion-item>

    <ion-button :disabled="!inputIsValid || progress"
                color="primary"
                expand="block"
                mode="ios"
                shape="round"
                size="large"
                style="bottom: 0; position: fixed; width: 90%"
                @click="calculcate">
      Calculate
      <span v-if="progress" class="ion-margin-start">
        <ion-spinner></ion-spinner>
      </span>
    </ion-button>

    <ion-modal ref="modal" :is-open="showPayslip" trigger="open-modal" @didDismiss="payslipHide">
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
      <ion-content v-if="payslip" class="ion-padding">
        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Basic Pay:{{ formatAmount(payslip.basic_pay) }}
        </p>
        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Taxable Income:{{ formatAmount(payslip.taxable_income) }}
        </p>

        <p class="ion-margin-start text-muted" style="font-weight: 18px; font-style: italic;">Earnings</p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Allowance:{{ formatAmount(payslip.allowance) }}
        </p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Bonus:{{ formatAmount(payslip.bonus) }}
        </p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Reimbursement:{{ formatAmount(payslip.reimbursement) }}
        </p>

        <ion-text color="primary">

          <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter;border-bottom: 1px solid #3880ff">
            Gross Pay:{{ formatAmount(payslip.gross_pay) }}
          </p>
        </ion-text>

        <p class="text-muted ion-margin-start" style="font-weight: 18px; font-style: italic;">Deductions</p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          P.A.Y.E: {{ formatAmount(payslip.paye) }}
        </p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          NASSIT: {{ formatAmount(payslip.nassit) }}
        </p>

        <ion-text color="danger">
          <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter; border-bottom: 1px solid #eb445a">
            Total Deduct.:{{ formatAmount(payslip.total_deductions) }}
          </p>
        </ion-text>


        <ion-text color="success">
          <p class="ion-margin-start" style="font-size: 32px; font-weight: lighter; border-bottom: 1px double #2dd36f">
            Net Pay: {{ formatAmount(payslip.net_pay) }}
          </p>
        </ion-text>


      </ion-content>


    </ion-modal>


  </ion-content>

</template>

<script>
import {closeOutline} from "ionicons/icons";
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonText,
  IonSpinner
} from "@ionic/vue";
import axios from "axios";
export default {
  name: "SLPayroll",
  props: {
    countryCode: {
      default: "SL",
      type: String
    }
  },
  components: {
    IonContent,
    IonButton,
    IonDatetimeButton,
    IonDatetime,
    IonItem,
    IonLabel,
    IonToggle,
    IonIcon,
    IonText,
    IonSpinner
  },
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
      currencyCode: "SLE",
      progress: false
    }
  },
  computed: {
    inputIsValid() {
      return this.basic_salary > 0;
    }
  },
  methods: {
    payslipHide(){

      this.showPayslip=false;
    },
    formatAmount(amount) {
      return this.currencyCode + Intl.NumberFormat('en-US').format(amount);
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

      this.progress = true;

      const formData = new FormData();
      formData.append("basic_pay",Number(this.basic_salary));
      formData.append("bonus",Number(this.bonus));
      formData.append("allowance",Number(this.allowance));
      formData.append("status","resident");
      formData.append("deduct_pension",this.deductPension);
      formData.append("reimbursement",Number(this.reimbursement));
      formData.append("deduct_paye",this.deductIncomeTax);
      formData.append("date",new Date(this.date).toJSON().slice(0, 10));


      const URL = "/payroll/" + this.countryCode.toLowerCase() + "/gross-to-net";

      axios.post(URL, formData)
          .then(res => {

            this.showPayslip = true;
            this.payslip = res.data.data;

            this.progress = false;

          })
          .catch(error => {
            this.progress = false;

          })

    }


  },
  mounted() {
    this.date = new Date().toJSON();

  }
}
</script>

<style scoped>

</style>