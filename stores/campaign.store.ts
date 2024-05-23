import { uploadFile } from "~/helpers/ipfs/uploadFileIPFS";

export const useCampaignStore = defineStore("campaign", () => {
  const campaignName = ref<string | null>(null);
  const goalAmount = ref<number | null>(null);
  const description = ref<string | null>(null);
  const image = ref<File | null>(null);

  const steps = ref<
    {
      stepName: string;
      shortStepName: string;
      mainText: string;
      descriptionText: string;
      inputPlaceholder: string;
      completed: boolean;
      errorMessage: string;
      errorShow: boolean;
      inputValue: Ref<any>;
    }[]
  >([
    {
      stepName: "Find a name for your campaign",
      shortStepName: "Campaign name",
      mainText: "What will your campaign be called?",
      inputPlaceholder: "Enter campaign title here",
      descriptionText:
        "Choose a unique and memorable name that resonates with your cause. This will be the headline of your campaign and the first thing potential supporters see. Maximum 30 characters.",
      completed: true,
      errorMessage: "Campaign name is required",
      errorShow: false,
      inputValue: campaignName,
    },
    {
      stepName: "Set a goal amount",
      shortStepName: "Goal amount",
      mainText: "How much do you aim to raise?",
      inputPlaceholder: "Enter target amount",
      descriptionText:
        "Define your fundraising target. Think about the costs involved with your cause to set a realistic and achievable goal.",
      completed: false,
      errorMessage: "Goal amount is required",
      errorShow: false,
      inputValue: goalAmount,
    },
    {
      stepName: "Describe your campaign",
      shortStepName: "Campaign description",
      mainText: "What’s your campaign story?",
      inputPlaceholder: "Share the details of your cause...",
      descriptionText:
        "Tell the story behind your campaign. Be transparent and heartfelt to help others understand the impact their support will have.",
      completed: false,
      errorMessage: "Campaign description is required",
      errorShow: false,
      inputValue: description,
    },
    {
      stepName: "Upload a cover photo",
      shortStepName: "Photo upload",
      mainText: "Which image best represents your campaign?",
      inputPlaceholder: "No file chosen",
      descriptionText:
        "Choose a cover photo that encapsulates the spirit of your campaign. A good image can resonate with supporters and bring your story to life.",
      completed: false,
      errorMessage: "Image is required",
      errorShow: false,
      inputValue: image,
    },
  ]);

  function checkInputs() {
    return true;
  }

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

  return {
    campaignName,
    goalAmount,
    description,
    image,

    steps,
    checkInputs,
    sendCampaign,
  };
});
