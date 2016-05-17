# -*- coding: utf-8 -*-

# Description: generates an svg file based on Praat pitch data
# Example usage:
#   python pitch_to_svg.py data/open_audio_weekend.Pitch output/open_audio_weekend.svg 2000 400 80 240 0.1 0.1 6

from pprint import pprint
from praat import fileToPitchData
import svgwrite
import sys
import time

# input
if len(sys.argv) < 8:
    print "Usage: %s <inputfile.Pitch> <outputfile.svg> <width> <height> <min freq> <max freq> <min intensity> <min strength> <max radius>" % sys.argv[0]
    sys.exit(1)
INPUT_FILE = sys.argv[1]
OUTPUT_FILE = sys.argv[2]
TARGET_WIDTH = int(sys.argv[3])
TARGET_HEIGHT = int(sys.argv[4])
MIN_FREQ = float(sys.argv[5])
MAX_FREQ = float(sys.argv[6])
MIN_INTENSITY = float(sys.argv[7])
MIN_STRENGTH = float(sys.argv[8])
MAX_RADIUS = int(sys.argv[9])

def px(value):
    return "%spx" % value

# Retrieve pitch data from Praat file
frames = fileToPitchData(INPUT_FILE)
print "%s frames read from file %s" % (len(frames), INPUT_FILE)

# Total time
total_seconds = frames[-1]["start"]
print "A total of %s seconds (%s)" % (total_seconds, time.strftime('%M:%S', time.gmtime(total_seconds)))

# Init SVG
dwg = svgwrite.Drawing(filename=OUTPUT_FILE, size=(px(TARGET_WIDTH),px(TARGET_HEIGHT)))
circles = dwg.add(dwg.g(id='circles'))

# Loop through frames
for frame in frames:
    topCandidate = frame["candidates"][0]
    if frame["intensity"] > MIN_INTENSITY and topCandidate["strength"] > MIN_STRENGTH and MIN_FREQ <= topCandidate["frequency"] <= MAX_FREQ:
        x = (frame["start"]/total_seconds) * TARGET_WIDTH - MAX_RADIUS
        y = (1.0-(topCandidate["frequency"]-MIN_FREQ)/(MAX_FREQ-MIN_FREQ)) * TARGET_HEIGHT
        radius = topCandidate["strength"] * MAX_RADIUS
        circles.add(dwg.circle(center=(px(x), px(y)), r=px(radius), fill='black'))

# Save
dwg.save()
print "Wrote %s to file" % OUTPUT_FILE
