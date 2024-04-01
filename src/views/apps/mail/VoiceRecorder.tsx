import { Icon } from "@iconify/react";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";

interface VoiceRecorderProps {
  selectedAudios: { id: number; blob: Blob }[];
  setSelectedAudios: React.Dispatch<
    React.SetStateAction<{ id: number; blob: Blob }[]>
  >;
}
function VoiceRecorder({
  selectedAudios,
  setSelectedAudios,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    const chunks: Blob[] = [];
    mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
      chunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      setSelectedAudios((prevAudios) => [
        ...prevAudios,
        {
          id: prevAudios[prevAudios.length - 1]
            ? prevAudios[prevAudios.length - 1].id + 1
            : 0,
          blob: audioBlob,
        },
      ]);
    });

    mediaRecorder.start();
    setIsRecording(true);
    setRecorder(mediaRecorder);
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
    }
  };

  const handleDeleteSelectedAudio = (audioId: number) => {
    setSelectedAudios((prevAudios) =>
      prevAudios.filter((audio) => audio.id !== audioId)
    );
  };

  return (
    <Box
      sx={{
        py: 1,
        px: 4,
        display: "flex",
        flexWrap: "wrap",
        transition: "all 1s",
      }}
    >
      <IconButton onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? (
          <Icon icon="mdi:stop-pause" />
        ) : (
          <Icon icon="mdi:microphone" />
        )}
      </IconButton>
      {selectedAudios.map((audio, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            marginBottom: "3px",
            marginRight: "15px",
            alignItems: "center",
            position: "relative",
            transition: "all 0.3s",
            "&:hover button": {
              display: "inline-flex",
            },
          }}
        >
          <audio
            controls
            style={{ width: "200px", height: "40px", transition: "all 0.3s" }}
          >
            <source src={URL.createObjectURL(audio.blob)} type="audio/wav" />
          </audio>
          <IconButton
            sx={{
              display: "none",
              position: "absolute",
              left: "40%",
              top: "-75%",
              zIndex: 10,
              backgroundColor: "rgba(255,0,0,0.1)",
            }}
            onClick={() => handleDeleteSelectedAudio(audio.id)}
          >
            <Icon icon="mdi:remove" fontSize="1rem" color="red" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}

export default VoiceRecorder;
