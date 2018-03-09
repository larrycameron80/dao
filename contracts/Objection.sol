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

    function names_length() public view returns (uint) {
        return names.length;
    }

    function get_value(bytes32 varname) public view returns (int) {
        return values[varname].value;
    }

    function Objection() public {
        owner = msg.sender;
        names.push('objection_duration');
        names.push('objection_threshold');
        names.push('profile_price');
        values['objection_duration'] = Values({value: 2 days, used:true});
        values['objection_threshold'] = Values({value: 2, used:true}); // must at leat have 2 rejections
        values['profile_price'] = Values({value: 222, used:true});
    }

    event Fail();
    event Succeed(bytes32 varname, int value);
    event UserHasRejected(int indexed objection_id, address user);

    function get_variable_name() public view returns (string) {
        return bytes32ToStr(variable_name);
    }

    function get_proposed_value() public view returns (int) {
        return proposed_value;
    }

    function bytes32ToStr(bytes32 _bytes32) internal pure returns (string){
        // string memory str = string(_bytes32);
        // TypeError: Explicit type conversion not allowed from "bytes32" to "string storage pointer"
        // thus we should fist convert bytes32 to bytes (to dynamically-sized byte array)

        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
            }
        return string(bytesArray);
    }

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
            emit Fail();
            cleanup();
            return true;
          }
          if (now >= ending_date) {
            if (!values[variable_name].used)
              names.push(variable_name);
            values[variable_name] = Values({value:proposed_value, used:true});
            emit Succeed(variable_name, proposed_value);
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
