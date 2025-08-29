// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GreenH2Credits {
    enum Role { NONE, PRODUCER, CERTIFIER, BUYER }
    mapping(address => Role) public roles;
    mapping(address => uint256) public balance;

    struct MintReq { address producer; bytes32 certHash; uint256 amount; bool approved; }
    MintReq[] public requests;
    address public owner;

    event RoleUpdated(address indexed who, Role role);
    event MintRequested(uint256 indexed id, address indexed producer, bytes32 certHash, uint256 amount);
    event Minted(uint256 indexed id, address indexed producer, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);
    event Retired(address indexed who, uint256 amount, string reason);

    modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }

    constructor() { owner = msg.sender; }

    function setRole(address who, Role r) external onlyOwner {
        roles[who] = r; emit RoleUpdated(who, r);
    }

    function requestMint(bytes32 certHash, uint256 amount) external {
        require(roles[msg.sender] == Role.PRODUCER, "not producer");
        requests.push(MintReq(msg.sender, certHash, amount, false));
        emit MintRequested(requests.length - 1, msg.sender, certHash, amount);
    }

    function approveAndMint(uint256 id) external {
        require(roles[msg.sender] == Role.CERTIFIER, "not certifier");
        MintReq storage r = requests[id];
        require(!r.approved, "already");
        r.approved = true;
        balance[r.producer] += r.amount;
        emit Minted(id, r.producer, r.amount);
    }

    function transfer(address to, uint256 amount) external {
        require(balance[msg.sender] >= amount, "insufficient");
        balance[msg.sender] -= amount; balance[to] += amount;
        emit Transferred(msg.sender, to, amount);
    }

    function retire(uint256 amount, string calldata reason) external {
        require(balance[msg.sender] >= amount, "insufficient");
        balance[msg.sender] -= amount;
        emit Retired(msg.sender, amount, reason);
    }

    function getRequestsCount() external view returns (uint256) {
        return requests.length;
    }
}
