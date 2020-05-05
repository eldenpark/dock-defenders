#!/bin/bash
# yarn audio:merge_and_divide quadcopter_002.mp4 shipyard_002.mp3
# https://stackoverflow.com/questions/24804928/singler-line-ffmpeg-cmd-to-merge-video-audio-and-retain-both-audios
# https://stackoverflow.com/questions/7945747/how-can-you-only-extract-30-seconds-of-audio-using-ffmpeg
# ffmpeg -i shipyard_001.mp3 -ss 00:00:00 -t 00:20:00 -async 1 -c copy shipyard_002.mp3
# ffmpeg -i video.mp4 -i audio.mp3 -shortest output.mp4

for (( i = 0; i <= $#; i += 1 )); do
  printf "command line arg: %s: %s\n" $i "${!i}";
done

if [ -z $1 ] || [ -z $2 ]; then
  printf "You didn't specify either video file name (%s) or audio file name (%s)\n" $1 $2;
  exit 1;
fi

timestamp=$(date +%s);

root_path="$(pwd)/../..";
data_path="$root_path/data";
video_file_name=$1;
audio_file_name=$2;
video_file_path="$data_path/$video_file_name";
audio_file_path="$data_path/$audio_file_name";
output_path="$root_path/output/synthesized-sound";
audio_extract_file_path="$output_path/${timestamp}_audio_extract.mp3";
audio_merged_file_path="$output_path/${timestamp}_audio_merged.mp3";
video_without_audio_file_path="$output_path/${timestamp}_video_without_audio.mp4";
video_merged_file_path="$output_path/${timestamp}_merged.mp4";

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

combineTwoAudio() {
  printf "combineTwoAudio(): start\n"
  extract_command="ffmpeg -i $video_file_path $audio_extract_file_path";
  printf "combineTwoAudio(): extract audio command: %s\n" "$extract_command";
  $extract_command;

  merge_audio_command="ffmpeg -i $audio_file_path -i $audio_extract_file_path -filter_complex amerge -c:a libmp3lame -q:a 4 $audio_merged_file_path";
  printf "combineTwoAudio(): merge audio command: %s\n" "$merge_audio_command";
  $merge_audio_command;

  remove_audio_from_video_command="ffmpeg -i $video_file_path -an $video_without_audio_file_path";
  printf "combineTwoAudio(): remove audio from video command: %s\n" "$remove_audio_from_video_command";
  $remove_audio_from_video_command;

  merge_audio_with_silent_video="ffmpeg -i $video_without_audio_file_path -i $audio_merged_file_path -shortest $video_merged_file_path";
  printf "combineTwoAudio(): merge audio with silent video command: %s\n" "$merge_audio_with_silent_video";
  $merge_audio_with_silent_video;
}

divideAudio() {
  SAMPLING_DURATION=5;
  # audio_merged_file_path="$output_path/1588245746_audio_merged.mp3"; # temporary
  duration="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $audio_merged_file_path)";
  duration=${duration%.*}
  printf "divideAudio(): audio_merged_file_path: %s, duration: %s\n" $audio_merged_file_path $duration;

  for (( i = 0; i < $duration; i += $SAMPLING_DURATION )); do
    paddedIdx=$(printf "%03d" $i);
    divide_command="ffmpeg -i $audio_merged_file_path -ss $i -t $SAMPLING_DURATION -async 1 -c copy $output_path/${timestamp}_${paddedIdx}.mp3 -loglevel panic";
    printf "divide_command: %s\n" "$divide_command";
    $divide_command;
  done
}

cleanOutputPath;
combineTwoAudio;
divideAudio;
