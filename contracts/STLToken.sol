// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
* @title STLToken, a standard ERC20 token
* @author Rodrigo Acosta
* @notice Test token for solidity exam
*/
contract STLToken is ERC20, Ownable, ERC20Permit {
    /**
     * @param initialOwner the address that owns the contract
     */
    constructor(address initialOwner)
        ERC20("STLToken", "STL")
        Ownable(initialOwner)
        ERC20Permit("STLToken")
    {}

    /**
     * @param to address that will recieve the tokens
     * @param amount of tokens to send to address
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}