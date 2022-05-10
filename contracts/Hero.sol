// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

contract Hero {
    enum Class { Mage, Healer, Barbarian }

    mapping(address => uint[]) addressToHeroes;

    function getHeroes() public view returns (uint[] memory) {
        return addressToHeroes[msg.sender];
    }

    function createHero(Class class) public payable {
        require(msg.value >= 0.05 ether, "Not enough money, you cheapie bastard");
    }
}