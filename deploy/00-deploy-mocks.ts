import { DeployFunction } from 'hardhat-deploy/types';
import {
  DECIMALS,
  developmentChain,
  INITIAL_ANSWER,
  networkConfig,
} from '../helper-hardhat-config';

const deployMocks = async function({ getNamedAccounts, deployments, network }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    log('Local network detected! Deploying mocks...');
    await deploy('MockV3Aggregator', {
      contract: 'MockV3Aggregator',
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log('Mocks Deployed!');
    log('----------------------------------');
  }
};

export default deployMocks;

deployMocks.tags = ['all', 'mocks'];
