import { ServerGame } from "../../types/types";
import { postJson } from "../../utils/utils";

const game: ServerGame = {
    id: "codenames",
    name: "Codenames",
    author: "Vlaada Chvátil",
    description:
        "Two teams compete to see who can make contact with all of their agents first. Spymasters give one-word clues that can point to multiple words on the board. Their teammates try to guess words of the right color while avoiding those that belong to the opposing team. And everyone wants to avoid the assassin.",
    displayUrlText: "codenames.game",
    displayUrlHref: "https://codenames.game/",
    category: ["medium"],
    players: "2-8+",
    familyFriendly: true,

    getJoinGameUrl: async () => {
        const {
            game: { name },
            player: { credential: creds1 },
        } = await postJson("https://lobby.codenames.game/game/create", {
            nickname:
                "🚀🦀 after 10 sec, click Menu -> Reload my game, and I will leave!",
        });

        setTimeout(async () => {
            await postJson(
                "https://lobby.codenames.game/game/" + name + "/leave",
                { credentials: creds1 } // why did they have to add an "s" 😭😆
            );
        }, 10 * 1000);

        return {
            playerURL: "https://codenames.game/room/" + name,
        };
    },

    renameParams: {
        name: "nickname",
    },
};

export default game;
