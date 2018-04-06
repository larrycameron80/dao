var Freelancer = artifacts.require('./contracts/freelancer/Feelancerr.sol');

contract('Freelancer', function(accounts) {
  it('should check that the first account/freelancer is not active in the DAO', function() {
    return Freelancer.deployed().then(function(instance) {
      return instance.isFreelancerActive.call(accounts[0]);
    }).then(function(isFreelancerActive) {
      assert.equal(isFreelancerActive, false, 'The first account/freelancer was active in the DAO');
    });
  });
});
