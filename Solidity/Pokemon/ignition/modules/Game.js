import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GameModule", (m) => {
    const owner = m.getParameter("owner", m.getAccount(0));
    const game = m.contract("Game", [owner]);
    return { game };
});
