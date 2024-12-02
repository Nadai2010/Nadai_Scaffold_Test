use starknet::ContractAddress;

#[starknet::interface]
pub trait IMockToken<TContractState> {
    fn faucet(ref self: TContractState, recipient: ContractAddress, amount: u256);
}

#[starknet::contract]
mod MockToken {
    use openzeppelin_token::erc20::ERC20Component;
    use openzeppelin_token::erc20::ERC20HooksEmptyImpl;
    use openzeppelin_upgrades::UpgradeableComponent;
    use openzeppelin_upgrades::interface::IUpgradeable;
    use starknet::ClassHash;
    use starknet::ContractAddress;
    use super::IMockToken;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    #[abi(embed_v0)]
    impl MockTokenImpl of IMockToken<ContractState> {
        fn faucet(ref self: ContractState, recipient: ContractAddress, amount: u256) {
            self.erc20.mint(recipient, amount);
        }
    }

    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;

    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: ByteArray,
        symbol: ByteArray,
        initial_supply: u256,
        recipient: ContractAddress,
    ) {
        self.erc20.initializer(name, symbol);
        self.erc20.mint(recipient, initial_supply);
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.upgradeable.upgrade(new_class_hash);
        }
    }
}
