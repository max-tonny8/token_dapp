const fs = require('fs/promises');
const path = require('path');

async function main() {
    const contractPath = path.join('.', 'build', 'contracts', 'StarNotary.json');
    const buffer = await fs.readFile(contractPath);
    const json = JSON.parse(buffer.toString());
    const abi = JSON.stringify(json.networks, null, 4);
    await fs.writeFile('networks.json', abi);
}

main().catch(console.error);