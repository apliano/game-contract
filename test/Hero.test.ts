import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Contract } from 'ethers';

chai.use(chaiAsPromised);

async function createHero(): Promise<Contract> {
  const Hero = await ethers.getContractFactory('Hero');
  const hero = await Hero.deploy();
  await hero.deployed();

  return hero;
}

describe('Hero', () => {
  let hero: Contract;

  before(async () => {
    hero = await createHero();
  });

  it('should return a zero heroes array', async () => {
    expect(await hero.getHeroes()).to.have.length(0);
  });

  it('should fail at creating a hero cause of payment', async () => {
    await expect(
      hero.createHero(0, {
        value: ethers.utils.parseEther('0.0499999999'),
      }),
    ).to.be.rejectedWith('Not enough money, you cheapie bastard');
  });
});
