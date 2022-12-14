import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import CloseIcon from "@mui/icons-material/Close";
import arena from "../assets/Airport.jpg";

export default function Arena({}) {
  const { show, setShow, NFTARENA_WRITE, NFTARENA_READ, currentPlayer, address } =
    useContext(MainContext);

  const [arenaStatus, setArenaStatus] = useState(true);
  const [gold, setGold] = useState(0);

  useEffect(() => {
    async function fetchArena() {
      const status = await NFTARENA_READ?.arena();

      setArenaStatus(status[0]);
    }

    async function checkGold() {
      const val = (await NFTARENA_READ?.balanceOf(address, 1)).toNumber();
      setGold(val);
    }

    if (NFTARENA_READ && currentPlayer) {
      fetchArena();
      checkGold();
    }
  }, [NFTARENA_READ, currentPlayer]);

  return (
    <Box
      display={show === "arena" ? "flex" : "none"}
      width={"80%"}
      height={"80%"}
      bgcolor="#e3f2fd"
      position={"absolute"}
      top="10%"
      left="19%"
      sx={{ borderRadius: "5%" }}
    >
      <Box position={"absolute"} top="3%" left="92%">
        <Button onClick={() => setShow(false)} size="medium">
          <CloseIcon />
        </Button>
      </Box>

      {currentPlayer && (
        <Box width={"50%"} height={"50%"} position={"absolute"} top="5%" left="5%">
          <Typography fontSize={24}>
            {arenaStatus ? "The Airport Is Open" : "Sucessfully Entered to Airport"}
          </Typography>
        </Box>
      )}

      <Box position={"absolute"} top="80%" left="20%">
        <Button onClick={() => NFTARENA_WRITE.enterArena(currentPlayer.tokenId)}>
          Enter to Airport
        </Button>
      </Box>

      <Box
        component="img"
        src={arena}
        width={"60%"}
        height={"45%"}
        position={"absolute"}
        top="20%"
        left="22%"
      ></Box>
    </Box>
  );
}
