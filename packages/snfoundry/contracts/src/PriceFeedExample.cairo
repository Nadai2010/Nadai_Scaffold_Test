use starknet::ContractAddress;

#[starknet::interface]
pub trait IPriceFeedExample<TContractState> {
    fn get_eth_usd_spot_price_median(self: @TContractState) -> u128;
    fn get_btc_usd_spot_price_median(self: @TContractState) -> u128;
    fn get_strk_usd_spot_price_median(self: @TContractState) -> u128;
    fn get_lords_usd_spot_price_median(self: @TContractState) -> u128;
}

#[starknet::contract]
mod PriceFeedExample {
    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use pragma_lib::abi::{IPragmaABIDispatcher, IPragmaABIDispatcherTrait};
    use pragma_lib::types::{AggregationMode, DataType, PragmaPricesResponse};
    use starknet::contract_address::contract_address_const;
    use starknet::get_caller_address;
    use super::{ContractAddress, IPriceFeedExample};

    const EIGHT_DECIMAL_FACTOR: u256 = 100000000;
    const ETH_USD_KEY: felt252 = 19514442401534788; // felt252 conversion of "ETH/USD"
    const BTC_USD_KEY: felt252 = 18669995996566340; // felt252 conversion of "BTC/USD"
    const STRK_USD_KEY: felt252 = 6004514686061859652; // felt252 conversion of "STRK/USD"
    const LORDS_USD_KEY: felt252 = 1407668255603079598916; // felt252 conversion of "LORDS/USD"

    #[storage]
    struct Storage {
        pragma_contract: ContractAddress,
        product_price_in_usd: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, pragma_contract: ContractAddress) {
        self.pragma_contract.write(pragma_contract);
        self.product_price_in_usd.write(100);
    }

    #[abi(embed_v0)]
    impl PriceFeedExampleImpl of IPriceFeedExample<ContractState> {
        fn get_eth_usd_spot_price_median(self: @ContractState) -> u128 {
            let oracle_address: ContractAddress = contract_address_const::<
                0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b
            >();
            let oracle_dispatcher = IPragmaABIDispatcher { contract_address: oracle_address };
            let output: PragmaPricesResponse = oracle_dispatcher
                .get_data(DataType::SpotEntry(ETH_USD_KEY), AggregationMode::Median(()));
            return output.price;
        }

        fn get_btc_usd_spot_price_median(self: @ContractState) -> u128 {
            let oracle_address: ContractAddress = contract_address_const::<
                0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b
            >();
            let oracle_dispatcher = IPragmaABIDispatcher { contract_address: oracle_address };
            let output: PragmaPricesResponse = oracle_dispatcher
                .get_data(DataType::SpotEntry(BTC_USD_KEY), AggregationMode::Median(()));
            return output.price;
        }

        fn get_strk_usd_spot_price_median(self: @ContractState) -> u128 {
            let oracle_address: ContractAddress = contract_address_const::<
                0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b
            >();
            let oracle_dispatcher = IPragmaABIDispatcher { contract_address: oracle_address };
            let output: PragmaPricesResponse = oracle_dispatcher
                .get_data(DataType::SpotEntry(STRK_USD_KEY), AggregationMode::Median(()));
            return output.price;
        }

        fn get_lords_usd_spot_price_median(self: @ContractState) -> u128 {
            let oracle_address: ContractAddress = contract_address_const::<
                0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b
            >();
            let oracle_dispatcher = IPragmaABIDispatcher { contract_address: oracle_address };
            let output: PragmaPricesResponse = oracle_dispatcher
                .get_data(DataType::SpotEntry(LORDS_USD_KEY), AggregationMode::Median(()));
            return output.price;
        }
    }
}
