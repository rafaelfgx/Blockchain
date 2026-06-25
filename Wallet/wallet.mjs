import bip32 from "bip32";
import bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";

const
    path = "m/44'/0'/0'/0/0",
    network = bitcoin.networks.testnet,
    mnemonic = bip39.generateMnemonic(),
    node = bip32(ecc).fromSeed(bip39.mnemonicToSeedSync(mnemonic), network).derivePath(path),
    address = bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address;

console.log({
    mnemonic: mnemonic,
    private: node.toWIF(),
    public: node.publicKey.toString("hex"),
    address: address
});
