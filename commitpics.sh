#!/bin/sh

NOW=$(date +"%Y-%m-%d-%H-%M-%S")

fswebcam -d /dev/video1 "~/commitpics/$NOW.jpg"
