import { Spacer } from "@geist-ui/react";
import PrimaryButton from "../common/PrimaryButton";
import { useCallback, useState } from "react";
import {
    GameState,
    ClientGameLibrary,
    Player,
    MenuButton,
} from "../../types/types";
import GameMenu from "../in-game/GameMenu";
import GameSelector from "../library/GameSelector";
import PlayerList from "../party/PlayerList";
import GameFrame from "../in-game/GameFrame";

const GameLayout = ({
    gameState,
    path,
    selectedGameId,
    onExitGame,
    onStartGame,
    onHostGameLoaded,
    gameLibrary,
    playerList,
    thisPlayer,
}: GameLayoutProps): JSX.Element => {
    const thisGame = gameLibrary.gameList.find(
        ({ id }) => id == selectedGameId
    );

    const { isHost } = thisPlayer;

    const [statusCollapsed, setStatusCollapsed] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showGameLibrary, setShowGameLibrary] = useState(false);
    const [showPlayerList, setShowPlayerList] = useState(false);

    // https://stackoverflow.com/a/48830513
    const [frameRefresh, setFrameRefresh] = useState(0);

    const menuButtons: Array<MenuButton> = [
        {
            label: "Reload my game",
            hostOnly: false,
            onClick: useCallback(() => {
                setShowMenu(false);
                setFrameRefresh(frameRefresh + 1);
            }, [frameRefresh]),
        },
        {
            label: "View players",
            hostOnly: false,
            onClick: useCallback(() => {
                setShowMenu(false);
                setShowPlayerList(true);
            }, []),
        },
        {
            label: "View games",
            hostOnly: false,
            onClick: useCallback(() => {
                setShowMenu(false);
                setShowGameLibrary(true);
            }, []),
        },
        {
            label: "Reload all",
            hostOnly: true,
            onClick: useCallback(() => {
                setShowMenu(false);
                onStartGame();
            }, [onStartGame]),
        },
        {
            label: "Exit to party",
            hostOnly: true,
            onClick: useCallback(() => {
                setShowMenu(false);
                onExitGame();
            }, [onExitGame]),
        },
    ];

    const statusClass = "status " + (statusCollapsed ? "status-collapsed" : "");
    return (
        <div className="layout">
            <div className={statusClass}>
                <h4
                    className="logo"
                    onClick={() => {
                        setStatusCollapsed(!statusCollapsed);
                        setShowMenu(false);
                        setShowGameLibrary(false);
                        setShowPlayerList(false);
                    }}
                >
                    🚀🦀
                </h4>
                {!statusCollapsed && (
                    <>
                        <div className="url">rocketcrab.com/{path}</div>
                        <PrimaryButton
                            onClick={() => {
                                setShowMenu(!showMenu);
                                setShowGameLibrary(false);
                                setShowPlayerList(false);
                            }}
                            size="small"
                        >
                            {showMenu ? "▲" : "▼"} Menu
                        </PrimaryButton>

                        {showMenu && (
                            <GameMenu
                                isHost={isHost}
                                menuButtons={menuButtons}
                            />
                        )}
                    </>
                )}
            </div>
            <GameFrame
                gameState={gameState}
                selectedGameId={selectedGameId}
                onHostGameLoaded={onHostGameLoaded}
                thisPlayer={thisPlayer}
                thisGame={thisGame}
                frameRefreshCount={frameRefresh}
            />
            {showGameLibrary && (
                <div className="component-frame">
                    <GameSelector
                        gameLibrary={gameLibrary}
                        onDone={() => setShowGameLibrary(false)}
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onSelectGame={() => {}}
                        backToLabel="game"
                        isHost={isHost}
                    />
                </div>
            )}
            {showPlayerList && (
                <div className="component-frame">
                    <div>🚀🦀 Players:</div>
                    <Spacer y={0.5} />
                    <PlayerList playerList={playerList} />
                    <Spacer y={0.5} />
                    <PrimaryButton onClick={() => setShowPlayerList(false)}>
                        Close
                    </PrimaryButton>
                </div>
            )}
            <style jsx>{`
                .layout {
                    display: flex;
                    flex-flow: column;
                    height: 100%;
                }
                .status {
                    border-bottom: 1px solid #ddd;
                    display: flex;
                    justify-content: space-between;
                    align-content: center;
                    padding: 0.5em;
                    height: 2em;
                    z-index: 1;
                }
                @media only screen and (max-width: 385px) {
                    .status {
                        font-size: 0.9em;
                        margin-bottom: 0em;
                    }
                    .logo {
                        line-height: 2em;
                        font-size: 1em;
                    }
                }
                .status-collapsed {
                    position: fixed;
                    width: fit-content;
                    border-right: 1px solid #ddd;
                }
                .logo {
                    margin: 0;
                    user-select: none;
                    cursor: pointer;
                }
                .url {
                    font-size: 1.2em;
                    line-height: 1em;
                    height: 1em;
                    margin: auto 0;
                    font-weight: bold;
                    font-family: "Inconsolata", monospace;
                }
                .component-frame {
                    padding: 1em;
                    text-align: center;
                    position: absolute;
                    top: 3em;
                    right: 0;
                    background: white;
                    border: 1px solid #ddd;
                    width: min(24em, 100vw - 3em);
                    margin: 0.5em;
                    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
                }
            `}</style>
        </div>
    );
};

type GameLayoutProps = {
    gameState: GameState;
    selectedGameId: string;
    path: string;
    onExitGame: () => void;
    onStartGame: () => void;
    onHostGameLoaded: () => void;
    gameLibrary: ClientGameLibrary;
    playerList: Array<Player>;
    thisPlayer: Player;
};

export default GameLayout;
