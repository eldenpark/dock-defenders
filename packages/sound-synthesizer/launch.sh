#!/bin/bash
# https://stackoverflow.com/questions/24804928/singler-line-ffmpeg-cmd-to-merge-video-audio-and-retain-both-audios
# ffmpeg -i shipyard_001.mp3 -ss 00:00:00 -t 00:20:00 -async 1 -c copy shipyard_002.mp3
# ffmpeg -i video.mp4 -i audio.mp3 -shortest output.mp4

for (( i = 0; i <= $#; i += 1 )); do
  printf "command line arg: %s: %s\n" $i "${!i}";
done

if [ -z $1 ] || [ -z $2 ]; then
  printf "You didn't specify either video file path (%s) or audio file path (%s)\n" $1 $2;
  exit 1;
fi

timestamp=$(date +%s);

root_path="$(pwd)/../..";
data_path="$root_path/data";
video_file_name=$1;
audio_file_name=$2;
video_file_path="$data_path/$video_file_name";
audio_file_path="$data_path/$audio_file_name";
output_path="$root_path/output";
merge_file_path="$output_path/${timestamp}_audio_merged.mp3";

printf "outputPath: %s, timestamp: %s\n" $output_path $timestamp;

cleanOutputPath() {
  printf "cleanOutputPath(): start\n";
  for filename in `ls $output_path`; do
    if [ -f "$output_path/$filename" ]; then
      printf "cleanOutputPath(): filename: %s\n" "$output_path/$filename";
      rm $output_path/$filename;
    fi
  done
}

# cleanOutputPath;

combineTwoAudio() {
  printf "combineTwoAudio(): start\n"
  extract_command="ffmpeg -i $video_file_path $output_path/${timestamp}_audio.mp3";
  printf "combineTwoAudio(): extract audio command: %s\n" "$extract_command";
  $extract_command;

  merge_audio_command="ffmpeg -i $audio_file_path -i $output_path/${timestamp}_audio.mp3 -filter_complex amerge -c:a libmp3lame -q:a 4 $merge_file_path";
  printf "combineTwoAudio(): merge audio command: %s\n" "$merge_audio_command";
  $merge_audio_command;
}

# combineTwoAudio;

divideAudio() {
  SAMPLING_DURATION=3;
  merge_file_path="$output_path/1588243291_audio_merged.mp3";
  duration="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $merge_file_path)";
  duration=${duration%.*}
  printf "divideAudio(): merge_file_path: %s, duration: %s\n" $merge_file_path $duration;

  for (( i = 0; i < $duration; i += $SAMPLING_DURATION)); do
    divide_command="ffmpeg -i $merge_file_path -ss $i -t $SAMPLING_DURATION -async 1 -c copy $output_path/$timestamp_$i.mp3 -loglevel panic";
    printf "divide_command: %s\n" "$divide_command";
    $divide_command;
  done
}

divideAudio;
