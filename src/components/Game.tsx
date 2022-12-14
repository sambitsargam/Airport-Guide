import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import PlayerCard from "./PlayerCard";
import Train from "./Train";
import Airport from "./Airport";
import Bridge from "./Bridge";
import gameMap from "../assets/bg.png";
import MonetizationOnSharpIcon from "@mui/icons-material/MonetizationOnSharp";

export default function Game() {
  const { route, setRoute, show, setShow, NFTARENA_WRITE, NFTARENA_READ, currentPlayer, address } =
    useContext(MainContext);
  const [gold, setGold] = useState(0);

  useEffect(() => {
    async function checkGold() {
      const val = (await NFTARENA_READ?.balanceOf(address, 1)).toNumber();
      setGold(val);
    }

    if (NFTARENA_READ && currentPlayer) {
      checkGold();
    }
  }, [NFTARENA_READ, currentPlayer]);

  return (
    <Box
      display={route === "game" ? "flex" : "none"}
      flexDirection={"column"}
      position={"relative"}
      m={2}
    >
      <Box position={"absolute"} top="1%" left="1%">
        <PlayerCard />
      </Box>
      <Box component="img" width={"100%"} alt="Game Map." src={gameMap} />

      <Box position={"absolute"} top="35%" left="45%">
        <Button size="large"  variant="contained" onClick={() => setShow("arena")}>
          Airport
        </Button>
      </Box>

      <Box position={"absolute"} top="35%" left="60%">
        <Button size="large" variant="contained" onClick={() => setShow("train")}>
          Security Check
        </Button>
      </Box>

      <Box position={"absolute"} top="35%" left="75%">
        <Button  size="large" variant="contained" onClick={() => setShow("bridge")}>
         Take Flight
        </Button>
      </Box>

      <Box
        position={"absolute"}
        top="1.5%"
        left="90.5%"
        alignItems="center"
        bgcolor="#e3f2fd"
        width={"8%"}
        height={"8%"}
        justifyContent={"center"}
        display={"flex"}
        sx={{ borderRadius: "10%" }}
      >
        <Box display={"flex"} justifyContent="center" alignItems={"center"} gap={1}>
          <Typography variant="h6" fontSize={18}>
            {gold}
          </Typography>
          <MonetizationOnSharpIcon />
        </Box>
      </Box>

      <Train />
      <Airport />
      <Bridge />
    </Box>
  );
}
