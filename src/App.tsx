import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, useContract, useNetwork, useProvider, useSigner } from "wagmi";
import Game from "./components/Game";
import Mint from "./components/Mint";
import Navbar from "./components/Navbar";
import { CONTRACTS, NFTARENA_ABI } from "./constants/contracts";
import { MainContext } from "./contexts/MainContext";


interface Player {
  tokenId: number;
  uri: string;
  address: string;
  originDomain: number;
  hp: number;
  attack: number;
  status: number;
}

export default function App() {
  const [route, setRoute] = useState("game");
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [userPlayerList, setUserPlayerList] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [show, setShow] = useState("");

  const chainName = chain?.name;
  const NFTARENA_ADDRESS = CONTRACTS[chainName as keyof typeof CONTRACTS];

  const NFTARENA_READ = useContract({
    address: NFTARENA_ADDRESS,
    abi: NFTARENA_ABI,
    signerOrProvider: provider,
  });
  const NFTARENA_WRITE = useContract({
    address: NFTARENA_ADDRESS,
    abi: NFTARENA_ABI,
    signerOrProvider: signer,
  });

  const mainContext = {
    route,
    setRoute,
    address,
    NFTARENA_READ,
    NFTARENA_WRITE,
    currentPlayer,
    setCurrentPlayer,
    userPlayerList,
    show,
    setShow,
  };

  //get array of Players
  useEffect(() => {
    async function fetchPlayers() {
      const playerCount = (await NFTARENA_READ?.playerCount()).toNumber();
      const players = [] as Player[];
      const userPlayers = [] as Player[];
      let player: any[];
      let existingIdsArray = [] as number[];

      for (let i = 0; i < playerCount; i++) {
        existingIdsArray.push((await NFTARENA_READ?.tokenIdsArray(i)).toNumber());
      }

      for (let i = 0; i < existingIdsArray.length; i++) {
        player = await NFTARENA_READ?.players(existingIdsArray[i]);

        const playerObj = {
          tokenId: player[0]?.toNumber(),
          uri: player[1],
          address: player[2],
          originDomain: player[3]?.toNumber(),
          hp: player[4]?.toNumber(),
          attack: player[5]?.toNumber(),
          status: player[6],
        };
        players.push(playerObj);
      }
      players.map((player) => {
        if (player.address === address) {
          userPlayers.push(player);
        }
      });

      setPlayersList(players);
      setUserPlayerList(userPlayers);
      setCurrentPlayer(userPlayers[0]);
    }

    if (NFTARENA_READ) {
      fetchPlayers();
    }
  }, [NFTARENA_WRITE, route]);

  return (
    <MainContext.Provider value={mainContext}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        minHeight={"100vh"}
      >
        <Navbar />

        <Box display={"flex"} flexDirection="column" justifyContent={"center"} alignItems="center">
          <Game />
          <Mint />
        </Box>
        </Box>
    </MainContext.Provider>
  );
}
