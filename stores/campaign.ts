import { uploadFile } from "~/helpers/ipfs/uploadFileIPFS";

export const useCampaignStore = defineStore("campaign", () => {
  const campaignName = ref<string | null>(null);
  const goalAmount = ref<number | null>(null);
  const description = ref<string | null>(null);
  const image = ref<File | null>(null);

  const steps = ref<
    {
      stepName: string;
      inputPlaceholder: string;
      errorMessage: string;
      showErrorMessage: boolean;
      inputValue: Ref<any>;
    }[]
  >([
    {
      stepName: "Campaign name",
      inputPlaceholder: "Enter campaign title here",
      errorMessage: "Campaign name is required",
      showErrorMessage: false,
      inputValue: campaignName,
    },
    {
      stepName: "Goal amount",
      inputPlaceholder: "Enter target amount",
      errorMessage: "Goal amount is required",
      showErrorMessage: false,
      inputValue: goalAmount,
    },
    {
      stepName: "Campaign description",
      inputPlaceholder: "Share the details of your cause...",
      errorMessage: "Campaign description is required",
      showErrorMessage: false,
      inputValue: description,
    },
    {
      stepName: "Photo upload",
      inputPlaceholder: "No file chosen",
      errorMessage: "Image is required",
      showErrorMessage: false,
      inputValue: image,
    },
  ]);

  watch(
    steps,
    (newValues) => {
      steps.value.forEach((step, index) => {
        if (newValues[index].inputValue && step.showErrorMessage) {
          step.showErrorMessage = false;
        }
      });
    },
    { deep: true }
  );

  function checkAllStepsCompleted() {
    let allStepsCompleted = true;
    steps.value.forEach((step) => {
      step.showErrorMessage = !step.inputValue;
      !step.inputValue && (allStepsCompleted = false);
    });
    return allStepsCompleted;
  }

  function sendCampaign() {
    console.log("UPLOADING");
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
        console.log("DONE");
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
