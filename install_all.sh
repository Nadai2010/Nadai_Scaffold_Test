#!/bin/bash

# Set the Scarb version and Devnet commit
SCARB_VERSION="2.5.4"
DEVNET_COMMIT="46e0ec032956f0e7cbe0330f32b6b31eff824087"
FOUNDRY_VERSION="0.25.0"
BASE_DIR="packages/snfoundry"
DEVNET_DIR="$BASE_DIR/local-devnet"

# Function to install Scarb
install_scarb() {
    echo "Installing Scarb version $SCARB_VERSION..."
    curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh -s -- -v $SCARB_VERSION
    if [ $? -ne 0 ]; then
        echo "Failed to install Scarb."
        exit 1
    fi
}

# Function to clone or update Starknet Devnet from specific commit
install_devnet() {
    if [ -d "$DEVNET_DIR" ]; then
        echo "Removing existing content in $DEVNET_DIR..."
        rm -rf $DEVNET_DIR
    fi

    echo "Cloning Starknet Devnet from commit $DEVNET_COMMIT..."
    git clone https://github.com/0xSpaceShard/starknet-devnet-rs.git $DEVNET_DIR
    if [ $? -ne 0 ]; then
        echo "Failed to clone Starknet Devnet."
        exit 1
    fi
    cd $DEVNET_DIR
    git checkout $DEVNET_COMMIT
    if [ $? -ne 0 ]; then
        echo "Failed to checkout commit $DEVNET_COMMIT."
        exit 1
    fi
    cd -
}

# Function to install Starknet Foundry version
install_foundry() {
    echo "Installing Starknet Foundry version $FOUNDRY_VERSION..."
    curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
    if [ $? -ne 0 ]; then
        echo "Failed to install Starknet Foundry."
        exit 1
    fi
    snfoundryup -v $FOUNDRY_VERSION
    if [ $? -ne 0 ]; then
        echo "Failed to run snfoundryup with version $FOUNDRY_VERSION."
        exit 1
    fi
}

# Function to check versions after installation
check_versions() {
    echo "Checking versions..."
    snforge --version
    scarb --version
}

# Check if the base directory exists
if [ ! -d "$BASE_DIR" ]; then
    echo "The directory $BASE_DIR does not exist. Please clone the scaffold repository first."
    exit 1
fi

# Run the installation functions
install_scarb
install_devnet
install_foundry

# Check versions after installation
check_versions

echo "Installation of Scarb $SCARB_VERSION, Starknet Devnet 0.5.1, and Starknet Foundry $FOUNDRY_VERSION completed successfully."
