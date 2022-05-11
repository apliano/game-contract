import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Contract } from 'ethers';

chai.use(chaiAsPromised);

async function createHeroContract(): Promise<Contract> {
  const Hero = await ethers.getContractFactory('TestHero');
  const hero = await Hero.deploy();
  await hero.deployed();

  return hero;
}

describe('Hero', () => {
  let heroContract: Contract;

  beforeEach(async () => {
    heroContract = await createHeroContract();
  });

  it('should return a zero heroes array', async () => {
    expect(await heroContract.getHeroes()).to.have.length(0);
  });

  it('should fail at creating a hero cause of payment', async () => {
    await expect(
      heroContract.createHero(0, {
        value: ethers.utils.parseEther('0.0499999999'),
      }),
    ).to.be.rejectedWith('Not enough money, you cheapie bastard');
  });

  it('should create heroes with enough funds', async () => {
    heroContract.setRandom(30);
    const minClassValue = await heroContract.getSmallestHeroValue();
    const maxClassValue = await heroContract.getLargestHeroValue();

    for (
      let heroClass = minClassValue;
      heroClass <= maxClassValue;
      heroClass++
    ) {
      await heroContract.createHero(heroClass, {
        value: ethers.utils.parseEther('0.05'),
      });

      const heroes = await heroContract.getHeroes();
      const hero = heroes[heroClass];

      expect(await heroContract.getStrength(hero)).to.equal(13);
      expect(await heroContract.getDexterity(hero)).to.equal(14);
      expect(await heroContract.getHealth(hero)).to.equal(3);
      expect(await heroContract.getIntelligence(hero)).to.equal(1);
      expect(await heroContract.getMagic(hero)).to.equal(15);
      expect(await heroContract.getClass(hero)).to.equal(heroClass);
    }

    const heroes = await heroContract.getHeroes();
    expect(heroes).to.have.lengthOf(maxClassValue - minClassValue + 1);
  });
});
