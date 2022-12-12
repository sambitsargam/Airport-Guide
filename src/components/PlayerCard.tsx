import { Box, Typography } from "@mui/material";
import { providers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { MainContext } from "../contexts/MainContext";
import nftPreview from "/src/assets/download.gif";

export default function PlayerCard() {
  const { currentPlayer, setCurrentPlayer, userPlayerList } = useContext(MainContext);
  const currentPlayerIndex = userPlayerList.indexOf(currentPlayer);
  const { address } = useAccount();
  const [ENS, setENS] = useState("");

  useEffect(() => {
    //resolve address to ENS
    async function resolveAddress() {
      const provider = new providers.JsonRpcProvider(
        "https://eth-mainnet.alchemyapi.io/v2/7ifRMY_6b1FpBvwH0rGegS97INzbl4C9"
      );
      const ensName = await provider.lookupAddress(address as string);
      setENS(ensName!);
    }
    address && resolveAddress();
  }, [address]);

  if (!currentPlayer) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#e3f2fd"
        p={14}
        sx={{ borderRadius: "10%" }}
      >
        <Box sx={{ opacity: 1 }} display="flex" flexDirection="column" gap={3}>
          <Box
            component="img"
            sx={{ opacity: 1, height: 180, width: 180 }}
            alt="NFT image."
            src={nftPreview}
          />

          <Box sx={{ opacity: 1 }} display="flex" flexDirection="column">
            <Box display="flex" gap={1}>
              <Typography fontSize={30}>❤️ 00</Typography>
              <Typography fontSize={30}>🗡️ 00</Typography>
            </Box>
            <Typography fontSize={30}>Sambit ...</Typography>
            <Typography fontSize={30}>Address: ...</Typography>
            <Typography fontSize={30}>Origin: ...</Typography>
            <Typography fontSize={30}>Status: ...</Typography>

            <Box display="flex" justifyContent="space-between" width="100%" pt={1}>
              <Typography fontSize={30} sx={{ cursor: "pointer" }}>
                {"<"}
              </Typography>
              <Typography fontSize={30} sx={{ cursor: "pointer" }}>
                {">"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="#e3f2fd"
      p={14}
      sx={{ borderRadius: "0%" }}
    >
      <Box sx={{ opacity: 1 }} display="flex" flexDirection="column" gap={3}>
        <Box
          component="img"
          sx={{ opacity: 1, height: 180, width: 180 }}
          alt="NFT image."
          src={currentPlayer && currentPlayer.uri}
        />
        {currentPlayer && (
          <Box sx={{ opacity: 1 }} display="flex" flexDirection="column">
            <Box display="flex" gap={1}>
              <Typography fontSize={30}>❤️ {currentPlayer.hp}</Typography>
              <Typography fontSize={30}>🗡️ {currentPlayer.attack}</Typography>
            </Box>
            <Typography fontSize={30}>Sambit {currentPlayer.tokenId}</Typography>
            <Typography fontSize={30}>
              Address: {ENS ? ENS : currentPlayer.address.substring(0, 6)}
            </Typography>
            <Typography fontSize={30}>
              Chain:{" "}
              {currentPlayer.originDomain === 80001
                ? "Polygon"
                : currentPlayer.originDomain === 5
                ? "Ethereum"
                : currentPlayer.originDomain === 0x6d6f2d61
                ? "Moonbeam"
                : "Moonbeam"
                }
            </Typography>
            <Typography fontSize={30}>
              Status:{" "}
              {currentPlayer.status === 0
                ? "idle..."
                : currentPlayer.status === 1
                ? "Security Check..."
                :"Security Check"}
            </Typography>

            <Box display="flex" justifyContent="space-between" width="100%" pt={1}>
              <Typography
                fontSize={30}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (currentPlayerIndex === 0) {
                    setCurrentPlayer(userPlayerList[userPlayerList.length - 1]);
                  } else {
                    setCurrentPlayer(userPlayerList[currentPlayerIndex - 1]);
                  }
                }}
              >
                {"<"}
              </Typography>
              <Typography
                fontSize={30}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (currentPlayerIndex === userPlayerList.length - 1) {
                    setCurrentPlayer(userPlayerList[0]);
                  } else {
                    setCurrentPlayer(userPlayerList[currentPlayerIndex + 1]);
                  }
                }}
              >
                {">"}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
