import {
  CommonLineInput,
  CommonRichEditor,
  CommonETHInput,
  CampaignCreateFileUpload,
} from "#components";
import { useWeb3Storage } from "~/helpers/IPFS";
const { uploadFile } = useWeb3Storage();

export const useCampaignStore = defineStore("campaign", () => {
  const campaignName = ref<string | null>(null);
  const goalAmount = ref<number | null>(null);
  const description = ref<string | null>(null);
  const image = ref<File | null>(null);

  const steps: {
    stepName: string;
    errorMessage: string;
    showErrorMessage: Ref<boolean | null>;
    inputValue: Ref<any>;
    component: Component;
    props: {
      [key: string]: any;
    };
    events?: {
      [key: string]: (value: any) => void;
    };
  }[] = [
    {
      stepName: "Campaign name",
      errorMessage: "Campaign name is required",
      showErrorMessage: ref(false),
      inputValue: campaignName,
      component: markRaw(CommonLineInput),
      props: {
        placeholder: "Enter campaign title here",
        modelValue: computed(() => campaignName.value),
      },
      events: {
        onInput: (value) => {
          campaignName.value = value;
        },
      },
    },
    {
      stepName: "Goal amount",
      errorMessage: "Goal amount is required",
      showErrorMessage: ref(false),
      inputValue: goalAmount,
      component: markRaw(CommonETHInput),
      props: {
        placeholder: "Enter target amount",
        modelValue: computed(() => goalAmount.value),
      },
      events: {
        onInput: (value) => {
          goalAmount.value = value;
        },
      },
    },
    {
      stepName: "Campaign description",
      errorMessage: "Campaign description is required",
      showErrorMessage: ref(false),
      inputValue: description,
      component: markRaw(CommonRichEditor),
      props: {
        placeholder: "Share the details of your cause...",
        modelValue: computed(() => description.value),
      },
      events: {
        onInput: (value) => {
          description.value = value;
        },
      },
    },
    {
      stepName: "Photo upload",
      errorMessage: "Image is required",
      showErrorMessage: ref(false),
      inputValue: image,
      component: markRaw(CampaignCreateFileUpload),
      props: {
        placeholder: "No file chosen",
        modelValue: computed(() => image.value),
      },
      events: {
        onInput: (value) => {
          image.value = value;
        },
      },
    },
  ];

  watch(
    [campaignName, goalAmount, description, image],
    (newValues) => {
      steps.forEach((step, index) => {
        if (newValues[index] && step.showErrorMessage.value) {
          step.showErrorMessage.value = false;
        }
      });
    },
    { deep: true },
  );

  function checkAllStepsCompleted() {
    let allStepsCompleted = true;
    steps.forEach((step) => {
      step.showErrorMessage.value = !step.inputValue.value;
      step.showErrorMessage.value && (allStepsCompleted = false);
    });
    return allStepsCompleted;
  }

  function sendCampaign() {
    // console.log("UPLOADING");
    const resDataJSON = JSON.stringify({
      campaignName: campaignName.value,
      goalAmount: goalAmount.value?.toString(),
      description: description.value,
    });

    // Call the uploadFile function from the IPFS helper
    return uploadFile(resDataJSON, image.value)
      ?.then((cid) => {
        return cid;
        // Call the createCampaign function from the contract helper
        // createCampaign(cid);
      })
      .finally(() => {
        // console.log("DONE");
      });
  }

  return {
    campaignName,
    goalAmount,
    description,
    image,

    steps,
    checkAllStepsCompleted,
    sendCampaign,
  };
});
