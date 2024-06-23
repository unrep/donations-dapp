pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Fundraising is ReentrancyGuard {
    struct Campaign {
        address payable organizer;
        uint goalAmount;
        uint createdAt;
        uint raisedAmount;
        bool isOpen;
        bool isWithdrawn;
        string ipfsHash;
        string[] filters;
    }

    struct CampaignSummary {
        uint id;
        address organizer;
        uint createdAt;
        uint goalAmount;
        uint raisedAmount;
        bool isOpen;
        string ipfsHash;
        bool isWithdrawn;
    }

    string[] public campaignFilters = [
        "Animals",
        "Business",
        "Community",
        "Creative",
        "Education",
        "Emergencies",
        "Environment",
        "Events",
        "Faith",
        "Family",
        "Funerals_and_Memorials",
        "Medical",
        "Monthly_Bills",
        "Newlyweds",
        "Other",
        "Sports",
        "Travel",
        "Volunteer",
        "Wishes"
    ];

    function getAllCampaignFilters() public view returns (string[] memory) {
        return campaignFilters;
    }

    uint public nextCampaignId = 0;
    mapping(uint => Campaign) public campaigns;

    event CampaignCreated(uint campaignId, address organizer);
    event ContributionReceived(
        uint campaignId,
        address contributor,
        uint amount,
        uint timestamp
    );
    event CampaignStopped(uint campaignId);
    event CampaignCompleted(uint campaignId);
    event FundsWithdrawn(uint campaignId, uint amount);

    function getCampaign(
        uint _campaignId
    )
        public
        view
        returns (
            address organizer,
            uint goalAmount,
            uint createdAt,
            uint raisedAmount,
            string memory ipfsHash,
            bool isOpen,
            string[] memory filters,
            bool isWithdrawn
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.organizer,
            campaign.goalAmount,
            campaign.createdAt,
            campaign.raisedAmount,
            campaign.ipfsHash,
            campaign.isOpen,
            campaign.filters,
            campaign.isWithdrawn
        );
    }

    function getCampaignSummaries(
        uint[] memory campaignIds
    )
        public
        view
        returns (
            CampaignSummary[] memory summaries,
            string[][] memory allFilters
        )
    {
        summaries = new CampaignSummary[](campaignIds.length);
        allFilters = new string[][](campaignIds.length);

        for (uint i = 0; i < campaignIds.length; i++) {
            Campaign storage campaign = campaigns[campaignIds[i]];
            summaries[i] = CampaignSummary({
                id: campaignIds[i],
                organizer: campaign.organizer,
                createdAt: campaign.createdAt,
                goalAmount: campaign.goalAmount,
                raisedAmount: campaign.raisedAmount,
                isOpen: campaign.isOpen,
                ipfsHash: campaign.ipfsHash,
                isWithdrawn: campaign.isWithdrawn
            });
            allFilters[i] = campaign.filters;
        }
        return (summaries, allFilters);
    }

    function validateFilters(
        string[] memory _filters
    ) internal view returns (bool) {
        for (uint i = 0; i < _filters.length; i++) {
            bool isValid = false;
            for (uint j = 0; j < campaignFilters.length; j++) {
                if (
                    keccak256(abi.encodePacked(_filters[i])) ==
                    keccak256(abi.encodePacked(campaignFilters[j]))
                ) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                return false;
            }
        }
        return true;
    }

    function createCampaign(
        uint _goalAmount,
        string memory _ipfsHash,
        string[] memory _filters
    ) public nonReentrant {
        require(validateFilters(_filters), "One or more filters are invalid");

        campaigns[nextCampaignId] = Campaign({
            organizer: payable(msg.sender),
            goalAmount: _goalAmount,
            createdAt: block.timestamp,
            raisedAmount: 0,
            isOpen: true,
            isWithdrawn: false,
            ipfsHash: _ipfsHash,
            filters: _filters
        });

        emit CampaignCreated(nextCampaignId, msg.sender);
        nextCampaignId++;
    }

    function contribute(uint _campaignId) public payable nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isOpen, "Campaign is not open for contributions");

        campaign.raisedAmount += msg.value;

        emit ContributionReceived(
            _campaignId,
            msg.sender,
            msg.value,
            block.timestamp
        );

        if (campaign.raisedAmount >= campaign.goalAmount) {
            campaign.isOpen = false;
            emit CampaignCompleted(_campaignId);
        }
    }

    function withdrawFunds(uint _campaignId) public nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            msg.sender == campaign.organizer,
            "Only the campaign organizer can withdraw funds"
        );
        require(
            campaign.raisedAmount >= campaign.goalAmount,
            "Fundraising goal not met"
        );
        require(campaign.isOpen == false, "Campaign is still open");

        uint amount = campaign.raisedAmount;
        campaign.organizer.transfer(amount);

        emit FundsWithdrawn(_campaignId, amount);
        campaign.isWithdrawn = true;
    }

    function stopCampaign(uint _campaignId) public nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            msg.sender == campaign.organizer,
            "Only the campaign organizer can stop the campaign"
        );

        campaign.isOpen = !campaign.isOpen;

        emit CampaignStopped(_campaignId);
    }

    function containsAllFilters(
        string[] memory _campaignFilters,
        string[] memory _searchFilters
    ) private pure returns (bool) {
        for (uint i = 0; i < _searchFilters.length; i++) {
            bool found = false;
            for (uint j = 0; j < _campaignFilters.length; j++) {
                if (
                    keccak256(abi.encodePacked(_searchFilters[i])) ==
                    keccak256(abi.encodePacked(_campaignFilters[j]))
                ) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

    function searchCampaigns(
        uint _startDate,
        uint _endDate,
        string[] memory _searchFilters
    )
        public
        view
        returns (
            CampaignSummary[] memory summaries,
            string[][] memory allFilters
        )
    {
        uint[] memory tempIds = new uint[](nextCampaignId);
        uint count = 0;

        // First, find all campaign IDs that match the search criteria
        for (uint i = 0; i < nextCampaignId; i++) {
            if (
                campaigns[i].createdAt >= _startDate &&
                campaigns[i].createdAt <= _endDate &&
                containsAllFilters(campaigns[i].filters, _searchFilters)
            ) {
                tempIds[count] = i;
                count++;
            }
        }

        // Now, create arrays of the appropriate size for the found campaigns
        summaries = new CampaignSummary[](count);
        allFilters = new string[][](count);

        // Populate the summaries and filters
        for (uint i = 0; i < count; i++) {
            Campaign storage campaign = campaigns[tempIds[i]];
            summaries[i] = CampaignSummary({
                id: tempIds[i],
                organizer: campaign.organizer,
                createdAt: campaign.createdAt,
                goalAmount: campaign.goalAmount,
                raisedAmount: campaign.raisedAmount,
                isOpen: campaign.isOpen,
                ipfsHash: campaign.ipfsHash,
                isWithdrawn: campaign.isWithdrawn
            });
            allFilters[i] = campaign.filters;
        }

        return (summaries, allFilters);
    }

    function getCampaignsByOrganizer(
        address _organizer
    ) public view returns (uint[] memory) {
        uint[] memory tempIds = new uint[](nextCampaignId);
        uint count = 0;

        for (uint i = 0; i < nextCampaignId; i++) {
            if (campaigns[i].organizer == _organizer) {
                tempIds[count] = i;
                count++;
            }
        }

        uint[] memory result = new uint[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = tempIds[i];
        }

        return result;
    }
}
