// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

contract Hero {
    // Enum with values: 0 (Mage), 1 (Healer), 2 (Barbarian)
    enum Class { Mage, Healer, Barbarian }

    mapping(address => uint[]) addressToHeroes;

    function getLargestHeroValue() public pure returns (Class) {
        return type(Class).max;
    }

    function getSmallestHeroValue() public pure returns (Class) {
        return type(Class).min;
    }

    function generateRandom() internal virtual view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    }

    function getHeroes() public view returns (uint[] memory) {
        return addressToHeroes[msg.sender];
    }

    function getClass(uint hero) public pure returns (uint) {
        return hero & 0x3;
    }

    function getStrength(uint hero) public pure returns (uint) {
        // Skip the Class bits
        // Return the next 5 bits
        return (hero >> 2) & 0x1F;
    }

    function getHealth(uint hero) public pure returns (uint) {
        // Skip the Class & Strength bits
        // Return the next 5 bits
        return (hero >> 7) & 0x1F;
    }

    function getDexterity(uint hero) public pure returns (uint) {
        // Skip the Class, Strength & Health bits
        // Return the next 5 bits
        return (hero >> 12) & 0x1F;
    }

    function getIntelligence(uint hero) public pure returns (uint) {
        // Skip the Class, Strength, Health & Dexterity bits
        // Return the next 5 bits
        return (hero >> 17) & 0x1F;
    }

    function getMagic(uint hero) public pure returns (uint) {
        // Skip the Class, Strength, Health, Dexterity & Intelligence bits
        // Return the next 5 bits
        return (hero >> 22) & 0x1F;
    }

    function createHero(Class class) public payable {
        require(msg.value >= 0.05 ether, "Not enough money, you cheapie bastard");
        // stats are strength, health , dexterity, intellect, magic
        uint[] memory stats = new uint[](5);
        stats[0] = 2; // Strength starts at bit 2
        stats[1] = 7; // Health starts at bit 7
        stats[2] = 12; // Dexterity starts at bit 12
        stats[3] = 17; // Intelligence starts at bit 17
        stats[4] = 22; // Magic starts at bit 22

        uint length = stats.length;

        // Hero is an array:
        // Each stat goes from 0 to 18 -> Needs at most 5 bits
        // The class takes the last 2 bits
        //       M           I           D           H           S        C
        // [[_._._._._] [_._._._._] [_._._._._] [_._._._._] [_._._._._] [_._]]
        uint hero = uint(class);

        do {
            uint position = generateRandom() % length;
            // stats go from 18 to 1
            uint value = generateRandom() % (13 + length) + 1;

            // Bitwise OR to write a value
            // Shift to the left the amount of bits we want to skip
            hero |= value << stats[position];

            length--;
            stats[position] = stats[length];
        } while (length > 0);

        addressToHeroes[msg.sender].push(hero);
    }
}