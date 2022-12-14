import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import CloseIcon from "@mui/icons-material/Close";

export default function Train({}) {
  const { show, setShow, NFTARENA_WRITE, NFTARENA_READ, currentPlayer } = useContext(MainContext);

  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    async function fetchTrain() {
      const time = (await NFTARENA_READ?.trainings(currentPlayer.tokenId)).startTime.toNumber();
      setStartTime(time);
    }
    if (NFTARENA_READ && currentPlayer) {
      fetchTrain();
    }
  }, [NFTARENA_READ, currentPlayer]);

  return (
    <Box
      display={show == "train" ? "flex" : "none"}
      width={"80%"}
      height={"80%"}
      bgcolor="#e3f2fd"
      position={"absolute"}
      top="8%"
      left="19%"
      sx={{ borderRadius: "5%" }}
    >
      <Box position={"absolute"} top="3%" left="92%">
        <Button onClick={() => setShow(false)} size="medium">
          <CloseIcon />
        </Button>
      </Box>

      <Box position={"absolute"} top="5%" left="40%">
        <Typography fontSize={24}>Security Check</Typography>
      </Box>

      <Box
        component="img"
        src="https://user-images.githubusercontent.com/70655824/206920678-33a9df4d-c1c7-4c21-b1ad-c7c53d080122.jpg"
        width={"20%"}
        height={"30%"}
        position={"absolute"}
        top="25%"
        left="40%"
      ></Box>

      {currentPlayer && (
        <Box width={"50%"} height={"50%"} position={"absolute"} top="60%" left="37%">
          <Typography fontSize={24}>
            {currentPlayer.status == 2 ? "You are on Security Check" : "You Are Not On Security Check"}
          </Typography>
        </Box>
      )}

      {currentPlayer && (
        <Box width={"50%"} height={"50%"} position={"absolute"} top="90%" left="70%">
          <Typography fontSize={24}></Typography>
        </Box>
      )}

      <Box position={"absolute"} top="80%" left="30%">
        <Button onClick={() => NFTARENA_WRITE.startTraining(currentPlayer.tokenId)}>
          Begin Checking
        </Button>
      </Box>
      <Box position={"absolute"} top="80%" left="55%">
        <Button onClick={() => NFTARENA_WRITE.endTraining(currentPlayer.tokenId)}>
          Finish and Collect Bags
        </Button>
      </Box>
    </Box>
  );
}
