import { useContractCampaignStore } from "./contract.campaign";
import {
  CommonLineInput,
  CommonRichEditor,
  CommonETHInput,
  CampaignCreateFileUpload,
  CommonFiltersSelect,
} from "#components";
import { pinDirectoryToIPFS } from "~/helpers/IPFS";

export const useCampaignStore = defineStore("campaign", () => {
  const campaignId = ref<string>("0");
  const campaignName = ref<string | null>(null);
  const goalAmount = ref<number | null>(null);
  const description = ref<string | null>(null);
  const image = ref<File | null>(null);
  const { result: filters, execute: getFilters } = usePromise(() => {
    const { getCampaignFilters } = useContractCampaignStore();
    return getCampaignFilters().then((res) =>
      res.map((filter) => ({ text: filter, selected: false })),
    );
  });
  getFilters();
  const selectedFilters = computed(() =>
    filters.value?.filter((filter) => filter.selected),
  );

  const steps: {
    stepName: string;
    errorMessage: string;
    showErrorMessage: Ref<boolean | null>;
    inputValue: Ref<any>;
    completed: Ref<boolean>;
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
      completed: computed(() => !!campaignName.value),
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
      completed: computed(() => !!goalAmount.value),
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
      stepName: "Campaign filters",
      errorMessage: "Campaign filters are required",
      showErrorMessage: ref(false),
      inputValue: filters,
      component: markRaw(CommonFiltersSelect),
      completed: computed(() => !!selectedFilters.value?.length),
      props: {
        placeholder: "Select campaign filters",
        filters: computed(() => filters.value),
      },
      events: {
        onSelect: ({
          filterIndex,
          selected,
        }: {
          filterIndex: number;
          selected: boolean;
        }) => {
          filters.value && (filters.value[filterIndex].selected = selected);
        },
      },
    },
    {
      stepName: "Campaign description",
      errorMessage: "Campaign description is required",
      showErrorMessage: ref(false),
      inputValue: description,
      component: markRaw(CommonRichEditor),
      completed: computed(() => !!description.value),
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
      completed: computed(() => !!image.value),
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
    [campaignName, goalAmount, filters, description, image],
    (newValues) => {
      steps.forEach((step, index) => {
        if (newValues[index] && step.showErrorMessage.value) {
          if (index === 2) {
            step.showErrorMessage.value = !selectedFilters.value?.length;
          } else {
            step.showErrorMessage.value = false;
          }
        }
      });
    },
    { deep: true },
  );

  function checkAllStepsCompleted() {
    let allStepsCompleted = true;
    steps.forEach((step) => {
      step.showErrorMessage.value = !step.completed.value;
      step.showErrorMessage.value && (allStepsCompleted = false);
    });
    return allStepsCompleted;
  }

  async function sendCampaign() {
    const { createCampaign } = useContractCampaignStore();

    if (!goalAmount.value || !selectedFilters.value) {
      throw new Error("Required fields are empty");
    }

    const resDataJSON = JSON.stringify({
      campaignName: campaignName.value,
      description: description.value,
    });

    // Call the uploadFile function from the IPFS helper
    const ipfsHash = await pinDirectoryToIPFS(resDataJSON, image.value)?.then(
      (res) => res?.IpfsHash,
    );

    if (!ipfsHash) {
      throw new Error("Failed to upload campaign data to ipfs");
    }

    const filtersToSend = selectedFilters.value.map((filter) =>
      filter.text.replace(/\s/g, "_"),
    );

    await createCampaign(
      decimalToBigNumber(goalAmount.value, ETH_TOKEN.decimals),
      ipfsHash,
      filtersToSend,
    );
  }

  return {
    campaignId,
    campaignName,
    goalAmount,
    description,
    image,

    filters,

    steps,
    checkAllStepsCompleted,
    sendCampaign,
  };
});
