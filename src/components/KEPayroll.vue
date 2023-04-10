<template>
  <ion-content :fullscreen="true" class="ion-padding" style="transition: 0.3s ease-in-out">

    <ion-item v-if="date" class="ion-margin-top"
              style="border: 1px solid lightgrey; border-radius: 10px; margin-top: 30px;">

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
      <input v-model="allowance" class="mobitax-input" placeholder="Benefits" type="number">

    </ion-item>
    <small class="text-muted ion-margin-start">Such as allowances and bonuses</small>

    <ion-item class="ion-margin-top" lines="none">
      <input v-model="other_pensions" class="mobitax-input" placeholder="Other Pensions" type="number">
    </ion-item>


    <ion-item class="ion-margin-top" lines="none">
      <ion-toggle :checked="deduct_nssf" mode="ios" @ionChange="residentToggleChanged">Deduct NSSF</ion-toggle>
    </ion-item>

    <ion-item v-if="deduct_nssf"
              class="ion-margin-top ion-margin-bottom"
              lines="none"
              style="border: 1px solid lightgrey; border-radius: 10px; transition: 0.3s ease-in-out">
      <ion-select :interface-options="selectOptions" :value="nssf_rate" aria-label="Fruit" interface="action-sheet"
                  label="Method:"
                  placeholder="Select Method" @ionChange="methodChange">
        <ion-select-option value="new_method">Tiered</ion-select-option>
        <ion-select-option value="old_method">Old Rate({{ currencyCode }}200)</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item class="ion-margin-top" lines="none">
      <ion-toggle :checked="deduct_nhif" mode="ios" @ionChange="pensionToggleChanged">Deduct NHIF</ion-toggle>
    </ion-item>


    <ion-button :disabled="!inputIsValid || progress"
                class="ion-margin-top"
                color="primary"
                expand="block"
                mode="ios"
                shape="round"
                size="large"
                @click="calculcate">
      Calculate
      <span v-if="progress" class="ion-margin-start">
        <ion-spinner></ion-spinner>
      </span>
    </ion-button>

    <ion-modal
        ref="modal"
        :is-open="showPayslip" trigger="open-modal" @didDismiss="payslipHide">
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
        <p class="ion-margin-start text-muted" style="font-weight: 18px; font-style: italic;">Earnings</p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Basic Pay:{{ formatAmount(payslip.basic_pay) }}
        </p>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Benefits::{{ formatAmount(payslip.benefits) }}
        </p>

        <ion-text color="primary">

          <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter;border-bottom: 1px solid #3880ff">
            Gross Pay:{{ formatAmount(payslip.gross_pay) }}
          </p>
        </ion-text>


        <p class="ion-margin-start text-muted" style="font-weight: 18px; font-style: italic;">Deductions</p>


        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          P.A.Y.E:{{ formatAmount(payslip.net_paye) }}
        </p>


        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          NSSF:{{ formatAmount(payslip.nssf) }}
        </p>


        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          NHIF:{{ formatAmount(payslip.nhif) }}
        </p>


        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Other Pensions:{{ formatAmount(payslip.other_pensions) }}
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


        <ion-button color="primary"
                    expand="block"
                    fill="clear"
                    mode="ios"
                    @click="showTaxation=!showTaxation">
          {{ showTaxation ? "Hide" : "Show" }} Taxation
          <ion-icon v-if="!showTaxation" :icon="chevronDown"></ion-icon>
          <ion-icon v-else :icon="chevronUp"></ion-icon>

        </ion-button>

        <span v-if="showTaxation" style="transition: 0.3s ease-in-out">

        <p class="text-muted ion-margin-start" style="font-weight: 18px; font-style: italic;">Taxations</p>



        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Chargeable Pay:{{ formatAmount(payslip.chargeable_income) }}
        </p>



        <p class="ion-margin-start" style="font-size: 20px; font-weight: lighter; margin-left: 35px;">
          Personal Relief: {{ formatAmount(payslip.personal_relief) }}
        </p>


        <p class="ion-margin-start" style="font-size: 20px; font-weight: lighter;margin-left: 35px;">
          NHIF Relief(15%): {{ formatAmount(payslip.nhif_relief) }}
        </p>
        <ion-text color="danger">

      <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Tax Charged: {{ formatAmount(Number(payslip.nhif_relief) + Number(payslip.personal_relief)) }}
        </p>
        </ion-text>

        <p class="ion-margin-start" style="font-size: 28px; font-weight: lighter">
          Net Tax: {{ formatAmount(payslip.net_paye) }}
        </p>


        <p class="ion-margin-start" style="font-size: 20px; font-weight: lighter;margin-left: 35px;">
          Pension Relief: {{ formatAmount(payslip.pension_relief) }}
        </p>

        </span>

      </ion-content>


    </ion-modal>


  </ion-content>

</template>

<script>
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonItem,
  IonLabel, IonSpinner,
  IonText,
  IonToggle,
  IonSelect,
  IonSelectOption
} from "@ionic/vue";
import {closeOutline, chevronDown, chevronUp} from "ionicons/icons";
import axios from "axios";

export default {
  name: "KEPayroll",
  props: {
    countryCode: {
      default: "KE",
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
    IonSpinner,
    IonSelect,
    IonSelectOption
  },
  data() {
    return {
      selectOptions: {
        header: "Select Method",
        subHeader: 'Select how NSSF should be calculated',
        translucent: true
      },
      showTaxation: false,
      deduct_nssf: true,
      deduct_nhif: true,
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
      currencyCode: "KSH",
      progress: false,
      nssf_rate: 'new_method',
      other_pensions: null,
      chevronDown,
      chevronUp
    }
  },
  computed: {
    inputIsValid() {
      return this.basic_salary > 0;
    }
  },
  methods: {

    methodChange(method) {
      this.nssf_rate = method.detail.value;
    },

    payslipHide() {
      this.showPayslip = false;
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
      this.deduct_nssf = checked.detail.checked;

    }
    ,
    taxToggleChanged(checked) {
      this.deductIncomeTax = checked.detail.checked;

    },

    calculcate() {

      const data = {
        basic_pay: Number(this.basic_salary),
        benefits: Number(this.allowance),
        status: "resident",
        deduct_nssf: this.deduct_nssf,
        deduct_nhif: this.deduct_nhif,
        nssf_rate: this.nssf_rate,
        date: new Date(this.date).toJSON().slice(0, 10),
        other_pensions: Number(this.other_pensions)
      }


      this.progress = true;

      const URL = "/payroll/" + this.countryCode.toLowerCase() + "/gross-to-net";

      axios.post(URL, data)
          .then(res => {


            this.payslip = res.data.data;
            this.showPayslip = true;

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