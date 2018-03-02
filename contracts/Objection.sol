// TODO
// Cleanup: proposed_value = '' ? (displays 0 in the proposed_value form, otherwise)

pragma solidity ^0.4.19;

contract Objection {
    enum State { unknown, waiting }

    address owner;
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    State status = State.unknown;
    address public currentOwner;
    string public currentJustification;
    int public proposed_value;
    bytes32 public variable_name;
    uint public ending_date;
    address[] hasRejected;
    int public currentObjectionId;

    struct Values { int value; bool used; }

    mapping(bytes32 => Values) public values;
    bytes32[] public names;

    function Objection() public {
        owner = msg.sender;
        names.push('objection_duration');
        names.push('objection_threshold');
        values['objection_duration'] = Values({value: 2 days, used:true});
        values['objection_threshold'] = Values({value: 2, used:true}); // must at leat have 2 rejections
    }

    event Fail();
    event Succeed(bytes32 varname, int value);
    event UserHasRejected(int indexed objection_id, address user);

    function openObjection(string justification, int value, bytes32 variable) public {
        assert (status != State.waiting);
        currentJustification = justification;
        currentOwner = msg.sender;
        status = State.waiting;
        variable_name = variable;
        proposed_value = value;
        ending_date = now + uint(values['objection_duration'].value);
        currentObjectionId++;
    }

    function reject() public {
        if (status == State.waiting && (now < ending_date)) {
          hasRejected.push(msg.sender);
          UserHasRejected(currentObjectionId, msg.sender);
        }
    }

    function currentObjection() public returns (int) {
      if (ending_date > 0) {
        return currentObjectionId;
      }
    }

    // return true if an objection is ended and an event fired. False in other cases
    function endObjection() public onlyOwner returns (bool) {
        if (status == State.waiting) {
          if (hasRejected.length >= uint(values['objection_threshold'].value)) {
            Fail();
            cleanup();
            return true;
          }
          if (now >= ending_date) {
            if (!values[variable_name].used)
              names.push(variable_name);
            values[variable_name] = Values({value:proposed_value, used:true});
            Succeed(variable_name, proposed_value);
            cleanup();
            return true;
          }
        }
        return false;
    }

    function cleanup() private {
        status = State.unknown;
        delete hasRejected;
        currentJustification = '';
        proposed_value = 0;
        ending_date = 0;
        variable_name = '';
    }
    function forceEnd() public onlyOwner {
        ending_date = now;
        endObjection();
    }
}
