# -*- coding: utf-8 -*-

# Description: generates an svg file based on Praat pitch data
# Example usage:
#   python wav_to_svg.py data/open_audio_weekend.Sound output/open_audio_weekend_wav.svg 1200 240 0.05 2

from pprint import pprint
from praat import fileToWavData
import svgwrite
import sys
import time

# input
if len(sys.argv) < 6:
    print "Usage: %s <inputfile.Pitch> <outputfile.svg> <width> <height> <sample every in seconds> <stroke width>" % sys.argv[0]
    sys.exit(1)
INPUT_FILE = sys.argv[1]
OUTPUT_FILE = sys.argv[2]
TARGET_WIDTH = int(sys.argv[3])
TARGET_HEIGHT = int(sys.argv[4])
SAMPLE_EVERY = float(sys.argv[5])
STROKE_WIDTH = float(sys.argv[6])

def px(value):
    return "%spx" % value

# Retrieve wav data from Praat file
samples = fileToWavData(INPUT_FILE)
print "%s samples read from file %s" % (len(samples), INPUT_FILE)

# Total time
total_seconds = samples[-1]["start"]
print "A total of %s seconds (%s)" % (total_seconds, time.strftime('%M:%S', time.gmtime(total_seconds)))

# Init SVG
dwg = svgwrite.Drawing(filename=OUTPUT_FILE, size=(px(TARGET_WIDTH),px(TARGET_HEIGHT)))
waveform = dwg.add(dwg.g(id='waveform'))
points = []

# Go through samples
lastSample = None
for sample in samples:
    # normalize amplitude
    amplitude = (sample["amplitude"] + 1) * 0.5
    x = (sample["start"]/total_seconds) * TARGET_WIDTH
    y = (1.0-amplitude) * TARGET_HEIGHT

    if lastSample is None or abs(sample["start"]-lastSample["start"]) >= SAMPLE_EVERY:
        points.append((x, y))
        lastSample = sample

print "Created line with %s points" % len(points)

# Add points and save
waveform.add(dwg.polyline(points=points, fill='none', stroke='black', stroke_width=STROKE_WIDTH))
dwg.save()
print "Wrote %s to file" % OUTPUT_FILE
