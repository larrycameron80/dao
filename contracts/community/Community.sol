/* TODO:
 *   communityState should be renamed active and typed bool
 *   communityType should be either enum or bool (in which case renamed)
 *   communityBalanceForVoting is outdated
 */
pragma solidity ^0.4.18;

import '../ownership/Ownable.sol';
import './token/TalaoToken.sol';

/**
 * @title Community
 * @dev This contract details the TALAO communities.
 * @author Talao
 */
contract Community is Ownable {
    // Community name.
    string public communityName;

    // Active or inactive community.
    uint public communityState;

    // Open (0) or private (1) community.
    uint public communityType;

    // Sponsor address if private community.
    address public communitySponsor;

    // Token percentage balance for voting in community (10 = 10% token, 90% reputation).
    uint public communityBalanceForVoting;

    // Minimum tokens to vote in community.
    uint public communityMinimumToken;

    // Minimum reputation to vote in community.
    uint public communityMinimumReputation;

    // x 1/10000 community commission on job = 0 at bootstrap. 100 means 1%.
    uint public communityJobCom;

    // Fees to join community (0 by default).
    uint public communityMemberFees;

    // Community members.
    mapping(address => bool) public members;

    // Talao token.
    TalaoToken public talaotoken;

    // For test purposes.
    uint256 public communityTokenBalance;

    // Event: a freelancer joined a community.
    event CommunitySubscription(address indexed freelancer, bool msg);

    /**
    * @dev Create a community.
    * @param _token address The address of the token.
    * @param _name string Community name.
    * @param _comtype uint Open (0) or private (1) community.
    * @param _balance uint Token percentage balance for voting in community (10 = 10% token, 90% reputation).
    * @param _mintoken uint Minimum tokens to vote in community.
    * @param _minreputation uint Minimum reputation to vote in community.
    * @param _com uint x 1/10000 community commission on job = 0 at bootstrap. 100 means 1%.
    * @param _fees uint Fees to join community (0 by default).
    **/
    function Community(address _token, string _name, uint _comtype, uint _balance, uint _mintoken, uint _minreputation, uint _com, uint _fees)
        public
    {
        talaotoken = TalaoToken(_token);
        communityName = _name;
        communityType = _comtype;
        communityState = 1;
        communityBalanceForVoting = _balance;
        communityMinimumToken = _mintoken;
        communityMinimumReputation = _minreputation;
        communityJobCom = _com;
        communityMemberFees = _fees;
        communityTokenBalance = talaotoken.balanceOf(this);
    }

    /**
    * @dev Community voting rules.
    * @param _balance uint Token percentage balance for voting in community (10 = 10% token, 90% reputation).
    * @param _mintoken uint Minimum tokens to vote in community.
    * @param _minreputation uint Minimum reputation to vote in community.
    **/
    function setupVotingRules(uint _balance, uint _mintoken, uint _minreputation)
        public onlyOwner
    {
        require(token != 0 && reputation != 0);
        communityBalanceForVoting = _balance;
        communityMinimumToken = _mintoken;
        communityMinimumReputation = _minreputation;
    }

    /**
    * @dev Join a community.
    **/
    function joinCommunity()
        public
    {
        members[msg.sender] = true;
        CommunitySubscription(msg.sender, true);
    }

    /**
    * @dev Leave a community.
    **/
    function leaveCommunity()
        public
    {
        // Revert if not a member.
        if (!members[msg.sender]) {
            revert();
        }
        members[msg.sender] = false;
        CommunitySubscription(msg.sender, false);
    }

    /**
    * @dev Transfers tokens from the Community.
    * @param _to address Address to send the tokens to.
    * @param _amount uint256 Amount of tokens to transfer.
    **/
    function transferFunds(address _to, uint256 _amount)
        public onlyOwner
        returns (bool)
    {
        require (_amount <= talaotoken.balanceOf(this));
        talaotoken.transfer(_to, _amount);
        return true;
    }
}
