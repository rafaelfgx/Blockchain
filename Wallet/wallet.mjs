import { BIP32Factory } from "bip32";
import bip39 from "bip39";
import bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";

const network = bitcoin.networks.testnet;

const path = "m/44'/0'/0'/0/0";

const mnemonic = bip39.generateMnemonic();

const seed = bip39.mnemonicToSeedSync(mnemonic);

const node = BIP32Factory(ecc).fromSeed(seed, network).derivePath(path);

const address = bitcoin.payments.p2wpkh({ network, pubkey: node.publicKey }).address;

console.log("Mnemonic:", mnemonic);

console.log("Private:", node.toWIF());

console.log("Public:", node.publicKey.toString("hex"));

console.log("Address:", address);
