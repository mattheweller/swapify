from brownie import network, config, interface, Swapify, Token
from scripts.helpful_scripts import get_account
from web3 import Web3

# 0.1
AMOUNT = Web3.toWei(0.1, "ether")


def main():
    account = get_account()
    buyer = get_account(index=1)
    seller = get_account(index=2)

    # seller acquire token1
    # buyer acquire token2
    # seller propose swap
    # buyer propose offer
    # seller accept offer
    # check all good

    token = Token.deploy({"from": account})
    print("Token deployed at: ", token.address)

    swapify = Swapify.deploy({"from": account})
    print("Swapify deployed at: ", swapify.address)

    # seller acquire token0
    tx_seller = token.safeMint(seller, {"from": account})
    tx_seller.wait(1)

    # buyer acquire token1
    tx_buyer = token.safeMint(buyer, {"from": account})
    tx_buyer.wait(1)

    # buyer acquire token2
    tx_buyer = token.safeMint(buyer, {"from": account})
    tx_buyer.wait(1)

    # check owners of account
    owner0 = token.ownerOf(0)
    owner1 = token.ownerOf(1)
    owner2 = token.ownerOf(2)

    print("Sell is ", seller, "Owner 0 is", owner0)
    print("Buyer is ", buyer, "Owner 1 is", owner1)
    print("Buyer is ", buyer, "Owner 2 is", owner2)

    ## Create Swap
    tx_approve = token.approve(swapify.address, 0, {"from": seller})
    tx_approve.wait(1)

    tx_create = swapify.createSwap([token.address], [0], "My token", {"from": seller})
    tx_create.wait(1)

    ## Create Offer
    tx_approve1 = token.approve(swapify.address, 1, {"from": buyer})
    tx_approve1.wait(1)

    tx_approve2 = token.approve(swapify.address, 2, {"from": buyer})
    tx_approve2.wait(1)

    tx_create = swapify.proposeOffer(
        0, [token.address, token.address], [1, 2], {"from": buyer}
    )
    tx_create.wait(1)

    ## Accept Offer
    tx_accept = swapify.acceptOffer(0, 0, {"from": seller})
    tx_accept.wait(1)

    # check owners of account
    owner0 = token.ownerOf(0)
    owner1 = token.ownerOf(1)
    owner2 = token.ownerOf(2)

    print("Sell is ", seller, "Owner 0 is", owner0)
    print("Buyer is ", buyer, "Owner 1 is", owner1)
    print("Buyer is ", buyer, "Owner 2 is", owner2)
