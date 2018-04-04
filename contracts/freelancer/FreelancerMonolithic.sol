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

        // Active user?
        bool userState;

        // subscribion block
        int subscriptionBlock;

        // resignation block
        int resignationBlock;
    }

    struct MemberReputation {
        // contribution within the community
        int contributionRating;

        // to compute decay (over time decrease)
        int contributionRatingBlock;

        // Ratings by the clients.
        uint[4] clientRatings;
        uint[4] ratingWeights;
        uint counter;
    }

    // 650000 block average 3 months
    int blockPerQuarter;
    address owner;

    // If a newer version of this registry is available, force users to use it cf Drupal
    bool _registrationDisabled;

    // Mapping that matches Drupal generated hash with Ethereum Account address.
    // Drupal Hash => Ethereum address
    mapping(bytes32 => address) _accounts;
    mapping(address => FreelancerInfo) private freelancerData;

    // freelancer => (commmunity => reputation), for voting, weight depend on the community
    mapping(address => mapping(address => MemberReputation)) private freelancerReputation;

    // Drupal Event allowing listening to newly action
    event AccountCreatedEvent(address indexed from, bytes32 indexed hash, int error);

    // DAO Events
    event RatingUpdated(address indexed user);
    event ContributionUpdated(address indexed user);
    event FreelancerFired(address indexed user);

    /**
     * init owner and delay for decay calculation
     */
    function Freelancer() public {
        owner = msg.sender;
        blockPerQuarter = 650000;
    }

    /**
     * Minimum to join a DAO when non Drupal user
     */
    function joinDao() public {
        require(freelancerData[msg.sender].userState == false);
        freelancerData[msg.sender].userState = true;
        freelancerData[msg.sender].subscriptionBlock = int(block.number);
    }

    function fireaFreelancer(address freelance) onlyOwner public {
        require(freelancerData[freelance].userState == true);
        freelancerData[freelance].userState = false;
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
        require(freelancerData[freelance].userState == true);

        MemberReputation storage reputation = freelancerReputation[freelance][community];

        // update ratings & counter
        reputation.clientRatings[reputation.counter] = rating;
        reputation.ratingWeights[reputation.counter] = weight;
        reputation.counter = (reputation.counter + 1) % reputation.clientRatings.length;

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
        require(freelancerData[freelance].userState == true);

        MemberReputation storage reputation = freelancerReputation[freelance][community];

        int hundreddecay = (100 * (int(block.number) - reputation.contributionRatingBlock)) / blockPerQuarter;
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
        returns (bool userState, int contributionRating, uint clientRating)
    {
        userState = freelancerData[_freelance].userState;
        if (userState == false) {
            return (false, 0, 0);
        }
        MemberReputation memory reputation = freelancerReputation[_freelance][_community];
        contributionRating = reputation.contributionRating;
        for (uint i = 0; i < reputation.clientRatings.length; i++) {
            clientRating += reputation.ratingWeights[i] * reputation.clientRatings[i];
        }
    }

    /******************************************/
    /*   DRUPALtoDAO functions START HERE    */
    /******************************************/

    function accountCreated(address from, bytes32 _hash, int error) public {
        emit AccountCreatedEvent(from, _hash, error);
    }

    function validateFreelancerByHash (bytes32 drupalUserHash) constant public returns (address) {
        return _accounts[drupalUserHash];
    }

    function joinasafreelancer(bytes32 drupalUserHash) public {
        if (_accounts[drupalUserHash] == msg.sender) {
            // Hash allready registered to address.
            accountCreated(msg.sender, drupalUserHash, 4);
        } else if (_accounts[drupalUserHash] > 0) {
            // Hash allready registered to different address.
            accountCreated(msg.sender, drupalUserHash, 3);
        } else if (drupalUserHash.length > 32) {
            // Hash too long
            accountCreated(msg.sender, drupalUserHash, 2);
        } else if (_registrationDisabled) {
            // Registry is disabled because a newer version is available
            accountCreated(msg.sender, drupalUserHash, 1);
        } else {
            _accounts[drupalUserHash] = msg.sender;
            accountCreated(msg.sender, drupalUserHash, 0);
            freelancerData[msg.sender].subscriptionBlock = int(block.number);
            freelancerData[msg.sender].userState = true;
        }
    }
}
