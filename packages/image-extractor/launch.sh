#!/bin/bash
# https://trac.ffmpeg.org/wiki/Create%20a%20thumbnail%20image%20every%20X%20seconds%20of%20the%20video
# ffmpeg -i myvideo.avi -vf fps=1/60 img%03d.jpg

for (( i = 0; i <= $#; i += 1 )); do
  printf "command line arg: %s: %s\n" $i "${!i}";
done

if [ -z $1 ]; then
  printf "You didn't specify a video file name (%s)\n" $1;
  exit 1;
fi

timestamp=$(date +%s);

root_path="$(pwd)/../..";
data_path="$root_path/data";
video_file_name=$1;
video_file_path="$data_path/$video_file_name";
output_path="$root_path/output/image-extract";

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

takeScreenShots() {
  printf "takeScreenShots(): start\n"
  command="ffmpeg -i $video_file_path -vf fps=1 $output_path/${timestamp}_%03d.jpg"
  printf "takeScreenShots(): take screen shots command: %s\n" "$extract_command";
  $command;
}

cleanOutputPath
takeScreenShots
