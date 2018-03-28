pragma solidity ^0.4.18;

import '../ownership/Ownable.sol';
import './token/TalaoToken.sol';
import './Community.sol';

/**
 * @title Community fabriq
 * @dev This contract deploys Community contracts.
 * @author Talao
 */
contract CommunityFabriq is Ownable {

    TalaoToken public talaotoken;

    // Event: a community has been created.
    event CommunityListing (address community);

    /**
    * @dev Community fabriq.
    * @param _token address The address of the token.
    **/
    function CommunityFabriq (address _token)
        public
    {
        require (token != address(0x0));
        talaotoken = TalaoToken(token);
    }

    /**
    * @dev Create a community.
    * @param _name string Community name.
    * @param _comtype uint Open (0) or private (1) community.
    * @param _balance uint Token percentage balance for voting in community (10 = 10% token, 90% reputation).
    * @param _mintoken uint Minimum tokens to vote in community.
    * @param _minreputation uint Minimum reputation to vote in community.
    * @param _com uint x 1/10000 community commission on job = 0 at bootstrap. 100 means 1%.
    * @param _fees uint Fees to join community (0 by default).
    **/
    function createCommunityContract(string _name, uint _comtype,  uint _balance, uint _mintoken, uint _minreputation, uint _com, uint _fees)
        public onlyOwner
        returns (Community)
    {
        require (_balance <= 100);
        require (_minreputation <= 100);
        newcommunity = new Community(talaotoken, _name, _comtype, _balance, _mintoken, _minreputation, _com, _fees);
        newcommunity.transferOwnership(msg.sender);
        CommunityListing(newcommunity);
        return newcommunity;
    }

    /**
     * @dev Prevents accidental sending of ether to the factory.
     */
    function ()
        public
    {
        revert();
    }
}
