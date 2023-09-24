"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);

  const thumbnailImage =
    "https://sample-videos.com/img/Sample-jpg-image-500kb.jpg";

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.volume = volume;
      video.playbackRate = speed;
      video.addEventListener("play", () => setIsPlaying(true));
      video.addEventListener("pause", () => setIsPlaying(false));
      video.addEventListener("timeupdate", () =>
        setCurrentTime(video.currentTime)
      );
      video.addEventListener("loadedmetadata", () =>
        setDuration(video.duration)
      );
    }

    return () => {
      if (video) {
        video.removeEventListener("play", () => setIsPlaying(true));
        video.removeEventListener("pause", () => setIsPlaying(false));
        video.removeEventListener("timeupdate", () =>
          setCurrentTime(video.currentTime)
        );
        video.removeEventListener("loadedmetadata", () =>
          setDuration(video.duration)
        );
      }
    };
  }, [volume, speed]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (videoRef.current.volume === 0) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  // const toggleFullScreen = () => {
  //   if (videoRef.current) {
  //     if (isFullScreen) {
  //       if (document.exitFullscreen) {
  //         document.exitFullscreen();
  //       } else if (document.webkitExitFullscreen) {
  //         document.webkitExitFullscreen();
  //       }
  //       setIsFullScreen(false);
  //     } else {
  //       if (videoRef.current.requestFullscreen) {
  //         videoRef.current.requestFullscreen();
  //       } else if (videoRef.current.webkitRequestFullscreen) {
  //         videoRef.current.webkitRequestFullscreen();
  //       }
  //       setIsFullScreen(true);
  //     }
  //   }
  // };

  const handleProgressBarClick = (
    event: React.MouseEvent<HTMLProgressElement>
  ) => {
    if (videoRef.current) {
      const progressBar = event.currentTarget;
      const clickX = event.clientX - progressBar.getBoundingClientRect().left;
      const ratio = clickX / progressBar.clientWidth;
      const newTime = ratio * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center md:px-[100px] p-[20px]">
      <div className="xl:w-[800px] w-full p-[20px]">
        <video
          ref={videoRef}
          src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4"
          className="xl:w-[800px] xl:h-[500px] w-full p-[20px]"
          // controls
        />

        <div className="w-full">
          <div className="flex justify-between items-center px-[20px]">
            <div className="flex gap-4 items-center">
              <Image
                src={isPlaying ? "/pause.png" : "/play-buttton.png"}
                width={30}
                height={30}
                onClick={togglePlay}
                className="cursor-pointer"
                alt="play pause button"
              />
              <div className="time-indicator">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-2 ">
              <Image
                src={volume === 0 ? "/mute.png" : "/low-volume.png"}
                width={30}
                height={30}
                onClick={() => {
                  if (volume === 0) {
                    setVolume(1);
                  } else {
                    setVolume(0);
                  }
                }}
                alt="play pause button"
              />
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>

            <div>
              <Image
                src={"/settings.png"}
                width={30}
                height={30}
                onClick={() => setShowSpeed(!showSpeed)}
                className="cursor-pointer"
                alt="play pause button"
              />
              {showSpeed && (
                <div className="flex flex-col  gap-4 absolute mt-[20px]">
                  <button onClick={() => handleSpeedChange(0.5)}>0.5x</button>
                  <button onClick={() => handleSpeedChange(1)}>1x</button>
                  <button onClick={() => handleSpeedChange(1.5)}>1.5x</button>
                  <button onClick={() => handleSpeedChange(2)}>2x</button>
                </div>
              )}
            </div>
          </div>
          <progress
            className="w-full mt-4 px-[20px] rounded-lg cursor-pointer"
            value={currentTime}
            max={duration}
            onClick={handleProgressBarClick}
            
          />
        </div>
      </div>
    </div>
  );
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
};

const padZero = (num: number): string => {
  return num < 10 ? `0${num}` : num.toString();
};
