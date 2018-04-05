pragma solidity ^0.4.21;

import '../ownership/Ownable.sol';

/**
 * @title Freelancer
 * @dev This contract details a TALAO freelancer.
 * @author Talao
 */
contract Freelancer is Ownable {

    struct FreelancerInformation {
        // Active freelancer?
        bool isActive;
        // Blocked freelancer?
        bool isBlocked;
    }

    struct FreelancerCommunityReputation {
        // Ratings by the clients within a community.
        uint[4] clientsRatings;
        // Clients ratings weights within a community.
        uint[4] clientsRatingsWeights;
        // Pointer to loop through clients ratings and always keep 4.
        uint clientsRatingsPointer;
        // Community contribution score of the freelancer.
        int contributionScore;
        // Block number of the latest community contribution score update, to compute decay (reputation decreases with time).
        uint lastContributionBlock;
    }

    // Owner of the contract.
    address owner;
    // Number of blocks in a Quarter.
    int blocksPerQuarter;
    // Freelancers information.
    mapping(address => FreelancerInformation) private freelancerInformation;
    // Freelancers reputation by community. Freelancer address => (Community address => Reputation).
    mapping(address => mapping(address => FreelancerCommunityReputation)) private freelancerCommunityReputation;
    // Mapping of Marketplace user hashes => Freelancer Ethereum addresses.
    mapping(bytes32 => address) public marketplacesAccounts;

    // Event: a freelancer subscribed.
    event FreelancerSubscribed(address indexed _freelancerAddress);
    // Event: a freelancer subscribed from a Marketplace.
    event FreelancerSubscribedFromMarketPlace(
        address indexed _freelancerAddress,
        address indexed _marketplaceAddress,
        bytes32 indexed _marketplaceUserHash
    );
    // Event: a freelancer has a new client rating, within a community.
    event FreelancerNewClientRating(
        address indexed _freelancerAddress,
        address indexed _communityAddress,
        uint _clientRating,
        uint _clientRatingWeight
    );
    event FreelancerNewContribution(
        address indexed _freelancerAddress,
        address indexed _communityAddress,
        int _contributionValue
    );

    /**
    * @dev Init owner and delay for decay calculation.
    **/
    function Freelancer()
        public
    {
        // Owner = contract creator.
        owner = msg.sender;
        // 60s / 15blocks * 60min * 24h * 30d * 3months = 518400 blocks / quarter.
        blocksPerQuarter = 518400;
    }

    /**
    * @dev Join the DAO.
    **/
    function joinDao()
        public
    {
        // The user Ethereum address must not exist in the registry.
        require(freelancerInformation[msg.sender].isActive == false);
        // The user Ethereum address must not be blocked in the registry.
        require(freelancerInformation[msg.sender].isBlocked == false);

        freelancerInformation[msg.sender].isActive = true;

        emit FreelancerSubscribed(msg.sender);
    }

    /**
    * @dev Join the DAO from a Marketplace.
    * @param _marketplaceAddress The Marketplace Ethereum address.
    * @param _marketplaceUserHash The Marketplace can submit a unique hash by user.
    **/
    function joinDaoFromMarketplace(address _marketplaceAddress, bytes32 _marketplaceUserHash)
        public
    {
        // Marketplace Ethereum address can't be empty.
        require (_marketplaceAddress != address(0x0));
        // Marketplace user hash must be 32 bytes.
        require (_marketplaceUserHash.length == 32);
        // Marketplace user hash must not already exist.
        require(marketplacesAccounts[_marketplaceUserHash] == 0);

        joinDao();

        marketplacesAccounts[_marketplaceUserHash] = msg.sender;

        emit FreelancerSubscribedFromMarketPlace(msg.sender, _marketplaceAddress, _marketplaceUserHash);
    }

    /**
    * @dev Register a client rating for the freelancer, within a community.
    * @param _freelancerAddress address The freelancer Ethereum address.
    * @param _communityAddress address The community Ethereum address.
    * @param _clientRating uint The client rating. From 1 to 50.
    * @param _clientRatingWeight uint The client rating weight. From 1 to 5.
    **/
    function registerClientRating(
        address _freelancerAddress,
        address _communityAddress,
        uint _clientRating,
        uint _clientRatingWeight
    )
        public
    {
        // Freelancer must be active.
        require(freelancerInformation[_freelancerAddress].isActive == true);
        // Community Ethereum address can't be empty.
        require (_communityAddress != address(0x0));
        // Client rating must be between 1 and 50.
        require(_clientRating > 0 && _clientRating <= 50);
        // Client rating weight must be between 1 and 5.
        require(_clientRatingWeight > 0 && _clientRatingWeight <= 5);

        FreelancerCommunityReputation storage reputation = freelancerCommunityReputation[_freelancerAddress][_communityAddress];

        reputation.clientsRatings[reputation.clientsRatingsPointer] = _clientRating;
        reputation.clientsRatingsWeights[reputation.clientsRatingsPointer] = _clientRatingWeight;
        reputation.clientsRatingsPointer = (reputation.clientsRatingsPointer + 1) % reputation.clientsRatings.length; // TODO: SafeMath

        emit FreelancerNewClientRating(_freelancerAddress, _communityAddress, _clientRating, _clientRatingWeight);
    }

    /**
    * @dev Register a community contribution for the freelancer.
    * @param _freelancerAddress address The freelancer Ethereum address.
    * @param _communityAddress address The community Ethereum address.
    * @param _contributionValue int The contribution value. From 1 (least important) to 10 (most important).
    **/
    function registerCommunityContribution(
        address _freelancerAddress,
        address _communityAddress,
        int _contributionValue)
        public
    {
        // Freelancer must be active.
        require(freelancerInformation[_freelancerAddress].isActive == true);
        // Community Ethereum address can't be empty.
        require (_communityAddress != address(0x0));
        // Contribution value must be between 1 (least important) to 10 (most important).
        require(_contributionValue > 0 && _contributionValue <= 10);

        FreelancerCommunityReputation storage reputation = freelancerCommunityReputation[_freelancerAddress][_communityAddress];

        int decay = int(100 * (block.number - reputation.lastContributionBlock)) / blocksPerQuarter; // TODO: SafeMath
        reputation.contributionScore -= (decay * reputation.contributionScore) / 100; // TODO: SafeMath
        reputation.contributionScore += _contributionValue; // TODO: SafeMath
        if (reputation.contributionScore > 50) {
            reputation.contributionScore = 50;
        }
        reputation.lastContributionBlock = block.number;

        emit FreelancerNewContribution(_freelancerAddress, _communityAddress, _contributionValue);
    }

    /**
    * @dev Checks if the freelancer is active in the DAO.
    * @param _freelancerAddress address Address of the freelance.
    **/
    function isFreelancerActive(address _freelancerAddress)
        constant
        public
        returns (bool freelancerIsActive)
    {
        freelancerIsActive = freelancerInformation[_freelancerAddress].isActive;
    }

    /**
    * @dev Compute vote weight of one user within one community.
    * @param _freelancerAddress address Address of the freelance.
    * @param _communityAddress uint256 Address of the community.
    **/
    function getFreelancerVoteWeight(address _freelancerAddress, address _communityAddress)
        constant
        public
        returns (bool freelancerIsActive, int freelancerContributionRating, uint freelancerClientsRatings)
    {
        freelancerIsActive = freelancerInformation[_freelancerAddress].isActive;
        if (freelancerIsActive == false) {
            return (false, 0, 0);
        }
        FreelancerCommunityReputation memory reputation = freelancerCommunityReputation[_freelancerAddress][_communityAddress];
        int contributionScore = reputation.contributionScore;
        for (uint i = 0; i < reputation.clientsRatings.length; i++) {
            freelancerClientsRatings += reputation.clientsRatingsWeights[i] * reputation.clientsRatings[i]; // TODO: SafeMath
        }
    }

    /**
    * @dev Block a Freelancer Ethereum address.
    * @param _freelancerAddress address The freelancer Ethereum address to block.
    **/
    function blockFreelancer(address _freelancerAddress)
        public
        onlyOwner
    {
        // User must be active.
        require(freelancerInformation[_freelancerAddress].isActive == true);
        // User must not be blocked.
        require(freelancerInformation[_freelancerAddress].isBlocked == false);

        freelancerInformation[_freelancerAddress].isActive = false;
        freelancerInformation[_freelancerAddress].isBlocked = true;
    }

    /**
    * @dev Unblock a Freelancer Ethereum address.
    * @param _freelancerAddress address The freelancer Ethereum address to unblock.
    **/
    function unblockFreelancer(address _freelancerAddress)
        public
        onlyOwner
    {
        // User must not be active.
        require(freelancerInformation[_freelancerAddress].isActive == false);
        // User must be blocked.
        require(freelancerInformation[_freelancerAddress].isBlocked == true);

        freelancerInformation[_freelancerAddress].isActive = true;
        freelancerInformation[_freelancerAddress].isBlocked = false;
    }
}
