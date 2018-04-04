pragma solidity ^0.4.21;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}



/**
 * @title Freelancer
 * @dev This contract details a TALAO freelancer.
 * @author Talao
 */
contract Freelancer is Ownable {

    struct FreelancerInfo {

        // Active freelancer?
        bool userIsActive;

        // Block number when the freelancer subscribed.
        int subscriptionBlock;

        // Block number when the freelancer resigned.
        int resignationBlock;

        //
    }

    struct MemberReputation {

        // Contribution rating of the freelancer, within the community.
        int contributionRating;

        // Contibution rating block, to compute decay (reputation decreases with time).
        int contributionRatingBlock;

        // Ratings by the clients.
        uint[4] clientsRatings;

        // Ratings weights.
        uint[4] ratingsWeights;

        uint counter;
    }

    // Number of blocks in a Quarter.
    int blocksPerQuarter;

    // Owner of the contract.
    address owner;

    // Freelancers information.
    mapping(address => FreelancerInfo) private freelancerData;

    // Freelancers reputation by community. freelancer address => (community address => reputation).
    mapping(address => mapping(address => MemberReputation)) private freelancerReputation;

    // Mapping of Marketplace user hashes => Freelancer Ethereum addresses.
    mapping(bytes32 => address) public marketplaceAccounts;

    // Event: a freelancer subscribed.
    event FreelancerSubscribed(address indexed _freelancer, uint _blockNumber);

    // Event: a freelancer subscribed from a Marketplace.
    event FreelancerSubscribedFromMarketPlace(address indexed _freelancerAddress, address indexed _marketplaceAddress, bytes32 indexed _marketplaceUserHash);
    event RatingUpdated(address indexed user);
    event ContributionUpdated(address indexed user);
    event FreelancerFired(address indexed user);

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
        // The user Ethereum address must not exist yet in the registry.
        require(freelancerData[msg.sender].userIsActive == false);
        freelancerData[msg.sender].userIsActive = true;
        freelancerData[msg.sender].subscriptionBlock = int(block.number);
        emit FreelancerSubscribed(msg.sender, block.number);
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
        require(marketplaceAccounts[_marketplaceUserHash] == 0);

        marketplaceAccounts[_marketplaceUserHash] = msg.sender;
        freelancerData[msg.sender].subscriptionBlock = int(block.number);
        freelancerData[msg.sender].userIsActive = true;
        emit FreelancerSubscribed(msg.sender, block.number);
        emit FreelancerSubscribedFromMarketPlace(msg.sender, _marketplaceAddress, _marketplaceUserHash);
    }

    function fireaFreelancer(address freelance) onlyOwner public {
        require(freelancerData[freelance].userIsActive == true);
        freelancerData[freelance].userIsActive = false;
        freelancerData[freelance].resignationBlock = int(block.number);
        emit FreelancerFired(freelance);
    }

    /******************************************/
    /*         DAO functions  START HERE      */
    /******************************************/

    /**
     * Update of the last 4 client evaluations and economical weights
     * maximum client rating is 50
     * client rating are stored by community
     * we only need to store the last 4 ratings/community for voting within the DAO
     */
    function registerClientRating(address freelance, address community, uint rating, uint weight) public returns (bool) {
        require(weight != 0);
        require(rating > 0 && rating <= 50);
        require(freelancerData[freelance].userIsActive == true);

        MemberReputation storage reputation = freelancerReputation[freelance][community];

        // update ratings & counter
        reputation.clientsRatings[reputation.counter] = rating;
        reputation.ratingsWeights[reputation.counter] = weight;
        reputation.counter = (reputation.counter + 1) % reputation.clientsRatings.length;

        emit RatingUpdated(freelance);
        return true;
    }

    /**
     * Contribution update
     * maximum contribution is 50
     * new contribution number is added to previous contribution
     * Decay with 2 decimals is taken into account to decrease contribution number before adding new contribution
     */
    function updateContribution(address freelance, address community, int lastcontribution) public returns (int) {
        require(lastcontribution <= 50);
        require(freelancerData[freelance].userIsActive == true);

        MemberReputation storage reputation = freelancerReputation[freelance][community];

        int hundreddecay = (100 * (int(block.number) - reputation.contributionRatingBlock)) / blocksPerQuarter;
        reputation.contributionRating -= (hundreddecay * reputation.contributionRating) / 100;
        reputation.contributionRating += lastcontribution;

        if (reputation.contributionRating > 50) {
            reputation.contributionRating = 50;
        }

        reputation.contributionRatingBlock = int(block.number);
        emit ContributionUpdated(freelance);
        return reputation.contributionRating;
    }

    /**
    * @dev Compute vote weight of one user within one community.
    * @param _freelance address Address of the freelance.
    * @param _community uint256 Address of the community.
    **/
    function getFreelancerDataForVoting(address _freelance, address _community)
        constant
        public
        returns (bool userIsActive, int contributionRating, uint clientRating)
    {
        userIsActive = freelancerData[_freelance].userIsActive;
        if (userIsActive == false) {
            return (false, 0, 0);
        }
        MemberReputation memory reputation = freelancerReputation[_freelance][_community];
        contributionRating = reputation.contributionRating;
        for (uint i = 0; i < reputation.clientsRatings.length; i++) {
            clientRating += reputation.ratingsWeights[i] * reputation.clientsRatings[i];
        }
    }
}
