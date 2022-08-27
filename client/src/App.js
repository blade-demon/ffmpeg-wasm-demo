import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";

const ffmpeg = createFFmpeg({ log: true });

function App() {
  const videoRef = useRef();
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [videoSrc, setVideoSrc] = useState("");

  const load = async () => {
    setMessage("Loading ffmpeg-core.js");
    await ffmpeg.load();
    setReady(true);
    setMessage("Loading data");
  };

  const getBase64 = async (url) => {
    const { data } = await axios.get(url, {
      responseType: "blob",
    });

    return window.URL.createObjectURL(new Blob([data]));
  };

  const image2video = async () => {
    for (let i = 1; i <= 16; i += 1) {
      const fileData = await getBase64(
        `http://localhost:8080/images/screenshot${i}.webp`
      );
      ffmpeg.FS("writeFile", `screenshot${i}.webp`, await fetchFile(fileData));
    }

    await ffmpeg.run(
      "-framerate",
      "1",
      "-pattern_type",
      "glob",
      "-i",
      "*.webp",
      "-c:a",
      "copy",
      "-shortest",
      "-c:v",
      // "-t",
      // "100",
      // "-r",
      // "30",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "out.mp4"
    );
    const data = ffmpeg.FS("readFile", "out.mp4");

    console.log(data);

    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    );

    // videoRef.current.play();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="App">
      <div className="message">{message}</div>
      {videoSrc && (
        <video ref={videoRef} src={videoSrc} autoPlay controls></video>
      )}
      {ready && (
        <div className="button">
          <button
            onClick={() => {
              setMessage("Start transcoding");
              image2video();
            }}
          >
            开始转换
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
