// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title STLPool - STLToken pool
 * @author Rodrigo Acosta
 * @notice Test pool for solidity exam
 */
contract STLPool is Ownable {
    IERC20 public token;
    uint256 public totalDeposits;
    uint256 public totalRewards;
    mapping(address => uint256) public userDeposits;
    mapping(address => uint256) public userRewards;
    mapping(address => bool) public isInvestor;
    mapping(address => bool) public isDeposit;
    address[] public investors;

    /**
     * @dev the constructor
     * @param initialOwner the address that will own the contract
     * @param _tokenAddress the address of the ERC20 STLToken contract
     */
    constructor(address initialOwner, address _tokenAddress) 
        Ownable(initialOwner)
    {
        token = IERC20(_tokenAddress);
    }

    /**
     * @dev allows investors to deposit into the pool
     * @param amount the amount of ERC20 STLToken to deposit
     */

    function deposit(uint256 amount) external {
        require(amount > 0, "Deposit amount must be greater than zero");
        require(isDeposit[msg.sender] == false, "Investor already deposit.");

        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        // we keep track of both the total and investors deposits amount
        userDeposits[msg.sender] += amount;
        totalDeposits += amount;

        // if this is the first deposit, we add the investor to the array to iterate over them
        if (isInvestor[msg.sender] == false){
            isInvestor[msg.sender] = true;
            investors.push(msg.sender);
        }

        // isDeposit tracks the active investors at this moment. We will only iterate on the active ones.
        isDeposit[msg.sender] = true;
    }

    /**
     * The owner of the pool adds the rewards to be distributed between investors
     * @param amount the amount of ERC20 to add as reward
     */
    function addRewards(uint256 amount) external onlyOwner {
        require(amount > 0, "Reward amount must be greater than zero");
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        totalRewards += amount;
        // when a new reward is added, we perform the reward distribution among the active investors
        distributeRewards(amount);
    }

    /**
     * Allows the active investors to withdraw their investment
     */
    function withdraw() external {
        require(userDeposits[msg.sender] > 0, "No deposits found for this user");

        uint256 userDeposit = userDeposits[msg.sender];
        uint256 userReward = userRewards[msg.sender];

        // this user's reward was calculated at addRewards
        uint256 totalPayout = userDeposit + userReward;

        // Reset user state
        userDeposits[msg.sender] = 0;
        userRewards[msg.sender] = 0;

        // Update global state
        totalDeposits -= userDeposit;

        // this investor is no longer active
        isDeposit[msg.sender] = false;

        // we perform the token transfer from the pool to the investor
        require(token.transfer(msg.sender, totalPayout), "Token transfer failed");
    }

    /**
     * Iterates between all the active investors (meaning they have an active deposit in the pool) to calculate their shares.
     * @param amount how many ERC20 tokens where added as a reward
     */
    function distributeRewards(uint256 amount) internal {
        for (uint256 i = 0; i < investors.length; i++) {
            address user = investors[i];
            if (isDeposit[user]==true){
                uint256 userShare = (userDeposits[user] * amount) / totalDeposits;
                userRewards[user] += userShare;
            }
        }
    }

    /**
     * gets the pool balance
     */
    function getContractBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
