const Router = artifacts.require("NiftRouter.sol");
const WETH = artifacts.require("WETH.sol");
const Migrator = artifacts.require("NiftMigrator.sol");
const migrations = artifacts.require("Migrations.sol");

module.exports = async function (deployer, network) {
    let weth;
    const FACTORY_ADDRESS = '0xcd19B5Ad58FbFfC6E5fbecEfa376014b9A6bE249';

    if (network === 'mainnet') {
        weth = await WETH.at('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
    } else {
        await deployer.deploy(WETH);
        weth = await WETH.deployed();
    }

    await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);
    const _router = await Router.deployed();
    await deployer.deploy(Migrator, FACTORY_ADDRESS, _router.address);
    await deployer.deploy(migrations);

    console.table({
        NiftRouter: Router.address,
        NiftMigrator: Migrator.address,
        Migrations: migrations.address,
        WETH: WETH.address
    })
};