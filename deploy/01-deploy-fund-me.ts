import { DeployFunction } from 'hardhat-deploy/types';
import { developmentChains, networkConfig } from '../helper-hardhat-config';
import { verify } from '../utils/verify';

const deployFundMe = async function({
  getNamedAccounts,
  deployments,
  network,
}) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // what happens when we want to which chains?
  // mock for localhost or hardhat
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get('MockV3Aggregator');
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed'];
  }

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy('FundMe', {
    from: deployer,
    args: args, // put price feed address,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }

  log('----------------------------------');
};

export default deployFundMe;
deployFundMe.tags = ['all', 'fundMe'];
