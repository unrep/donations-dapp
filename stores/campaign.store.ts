import { uploadFile } from "~/helpers/ipfs/uploadFileIPFS";

export const useCampaignStore = defineStore("campaign", () => {
  const campaignName = ref("");
  const goalAmount = ref<bigint | null>(null);
  const description = ref("");
  const image = ref<File | null>(null);
  const errorMessage = ref<string | null>(null);

  const steps = ref<
    {
      stepName: string;
      shortStepName: string;
      mainText: string;
      descriptionText: string;
      inputPlaceholder: string;
      selected: boolean;
    }[]
  >([
    {
      stepName: "Find a name for your campaign",
      shortStepName: "Campaign name",
      mainText: "What will your campaign be called?",
      inputPlaceholder: "Enter campaign title here",
      descriptionText:
        "Choose a unique and memorable name that resonates with your cause. This will be the headline of your campaign and the first thing potential supporters see. Maximum 30 characters.",
      selected: true,
    },
    {
      stepName: "Set a goal amount",
      shortStepName: "Goal amount",
      mainText: "How much do you aim to raise?",
      inputPlaceholder: "Enter target amount",
      descriptionText:
        "Define your fundraising target. Think about the costs involved with your cause to set a realistic and achievable goal.",
      selected: false,
    },
    {
      stepName: "Describe your campaign",
      shortStepName: "Campaign description",
      mainText: "What’s your campaign story?",
      inputPlaceholder: "Share the details of your cause...",
      descriptionText:
        "Tell the story behind your campaign. Be transparent and heartfelt to help others understand the impact their support will have.",
      selected: false,
    },
    {
      stepName: "Upload a cover photo",
      shortStepName: "Photo upload",
      mainText: "Which image best represents your campaign?",
      inputPlaceholder: "No file chosen",
      descriptionText:
        "Choose a cover photo that encapsulates the spirit of your campaign. A good image can resonate with supporters and bring your story to life.",
      selected: false,
    },
    {
      stepName: "Done",
      shortStepName: "Done",
      mainText: "Are you ready to launch your campaign?",
      inputPlaceholder: "Not applicable",
      descriptionText:
        "Double-check all your details one last time. When you’re satisfied everything is perfect, let’s get your campaign started!",
      selected: false,
    },
  ]);
  function selectStep(indexToSelect: number) {
    setErrorMessage(null);
    steps.value.forEach((step, index) => {
      step.selected = indexToSelect === index;
    });
  }
  function incrementStep() {
    const currentSelectedIndex = steps.value.findIndex((step) => step.selected);
    if (currentSelectedIndex === steps.value.length - 1) {
      sendCampaign();
      return;
    }

    switch (currentSelectedIndex) {
      case 0:
        if (!campaignName.value) {
          setErrorMessage("Please enter a campaign name");
          return;
        }
        break;
      case 1:
        if (!goalAmount.value) {
          setErrorMessage("Please enter goal amount");
          return;
        }
        break;
      case 2:
        if (!description.value) {
          setErrorMessage("Please enter campaign description");
          return;
        }
        break;
      case 3:
        if (!image.value) {
          setErrorMessage("Please upload a cover photo");
          return;
        }
        break;
      default:
        break;
    }

    selectStep(currentSelectedIndex + 1);
  }
  function decrementStep() {
    const currentSelectedIndex = steps.value.findIndex((step) => step.selected);

    if (currentSelectedIndex === 0) return;

    selectStep(currentSelectedIndex - 1);
  }

  const currentStep = computed(() => {
    return {
      step: steps.value.find((step) => step.selected),
      index: steps.value.findIndex((step) => step.selected),
    };
  });

  function sendCampaign() {
    console.log("UPLOADING");
    const resDataJSON = JSON.stringify({
      campaignName: campaignName.value,
      goalAmount: goalAmount.value?.toString(),
      description: description.value,
    });

    // Call the uploadFile function from the IPFS helper
    uploadFile(resDataJSON, image.value)
      ?.then((cid) => {
        return cid;
        // Call the createCampaign function from the contract helper
        // createCampaign(cid);
      })
      .finally(() => {
        console.log("DONE");
      });
  }

  function setErrorMessage(message: string | null) {
    errorMessage.value = message;
  }

  return {
    campaignName,
    goalAmount,
    description,
    image,
    incrementStep,
    decrementStep,
    sendCampaign,
    steps,
    currentStep,
    errorMessage,
  };
});
