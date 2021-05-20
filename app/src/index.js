import Web3 from 'web3';
import starNotaryArtifact from '../../build/contracts/StarNotary.json';
/**
 * @typedef {import('web3-eth-contract').Contract} Contract
 * @typedef {import('web3-core').provider} Provider
 * @typedef {import('../../types/web3-v1-contracts/StarNotary').StarNotary} StarNotary
 */

/**
 * @returns {Promise<Provider>}
 */
async function loadProvider() {
    const win = /** @type {Window & typeof globalThis & {ethereum: any}} */ (window);
    if (win.ethereum) { 
        await win.ethereum.enable();
        return win.ethereum;
    } else {
        const url = 'http://127.0.0.1:9545';
        console.warn(`No web3 detected. Falling back to ${url}. You should remove this fallback when you deploy live`);
        return new Web3.providers.HttpProvider(url);
    }
}

/**
 * @param {string} message
 */
function setStatus(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
}

/**
 * @param {any} contract 
 * @returns {StarNotary}
 */
function castNotary(contract) {
    return contract;
}

class App {
    /**
     * @private
     * @param {Web3} web3 
     * @param {string} account 
     * @param {StarNotary} contract 
     */
    constructor(web3, account, contract) {
        this.web3 = web3;
        this.account = account;
        this.contract = contract;
    }

    /**
     * @public
     * @returns {Promise<App>}
     */
    static async start() {
        const web3 = new Web3(await loadProvider());
        const networkId = await web3.eth.net.getId();
        const contract = new web3.eth.Contract(
            // @ts-ignore
            starNotaryArtifact.abi,
            starNotaryArtifact.networks[networkId]
        );
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        return new App(web3, account, castNotary(contract));
    }

    /**
     * @public
     * @returns {Promise<void>}
     */
    async createStar() {
        try {
            const name = /** @type {HTMLInputElement} */ (document.getElementById('starName')).value;
            const id = /** @type {HTMLInputElement} */ (document.getElementById('starId')).value;
            await this.contract.methods.createStar(name, id).send({from: this.account});
            setStatus(`New Star owner is ${this.account}`);
        } catch (err) {
            setStatus(`Failed to create star: ${err}`);
        }
    }

    /**
     * @public
     * @returns {Promise<void>}
     */
    async lookUp() {
        try {
            const id = /** @type {HTMLInputElement} */ (document.getElementById('lookid')).value;
            const star = await this.contract.methods.lookUptokenIdToStarInfo(id).call();
            if (star) {
                setStatus(`Found star: ${star}`);
            } else {
                setStatus(`Star not found`);
            }
        } catch (err) {
            setStatus(`Failed to lookup star: ${err}`);
        }
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const app = await App.start();
    document.getElementById('lookupStar').addEventListener('click', () => app.lookUp());
    document.getElementById('createStar').addEventListener('click', () => app.createStar());
});