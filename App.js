import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Audio } from "expo-av";

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {}
  }

  async function stopRecording() {
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    let allRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    allRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    setRecordings(allRecordings);
  }

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording #{index + 1} | {recordingLine.duration}
          </Text>
          <Button
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
        </View>
      );
    });
  }

  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", flexDirection: "row", position : "absolute", top: 80 , alignItems : "center", justifyContent : "center" , gap : 10}}>
        <View><Image source={require("./assets/logo.png")} style={styles.logo} /></View>
        <View>
        <Text style={styles.text2}>
          Indian Institute of Information Technology , Sri City
        </Text>
        <Text style={{fontSize : 9 , textAlign : "center" , fontWeight : "bold", padding : 4}}>(An Institute of National Importance under an Act of Parliament)</Text>
        </View>
      </View>
      <Text style={styles.text}>Welcome to End-to-End Spoken Keyword Spotting System</Text>
      <Button
        title={recording ? "Stop Recording" : "Start Recording\n\n\n"}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
      <Button
        title={recordings.length > 0 ? "\n\n\nClear Recordings" : ""}
        onPress={clearRecordings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    position: "absolute",
    top: 150,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding : 10,
    color : "#6a31c4"
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  text2: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color : "#eb7434"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 40,
  },
  fill: {
    flex: 1,
    margin: 15,
  },
});
