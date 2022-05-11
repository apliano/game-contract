// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

import "./Hero.sol";

contract TestHero is Hero {
    uint random;

    function generateRandom() internal override view returns (uint) {
        return random;
    }

    function setRandom(uint r) public {
        random = r;
    }
}