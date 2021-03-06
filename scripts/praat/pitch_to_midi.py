# -*- coding: utf-8 -*-

# Description: generates a midi file based on Praat pitch data
# Example usage:
#   python pitch_to_midi.py data/open_audio_weekend.Pitch output/open_audio_weekend.mid 80 240 0.1 0.1 10 50

import json
from os import path
from praat import fileToPitchData
import sys
import time

sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
from midiutil.MidiFile import MIDIFile

# Input
if len(sys.argv) < 7:
    print "Usage: %s <inputfile.Pitch> <outputfile.mid> <min freq> <max freq> <min intensity> <min strength> <freq threshold> <min note duration>" % sys.argv[0]
    sys.exit(1)
INPUT_FILE = sys.argv[1]
OUTPUT_FILE = sys.argv[2]
MIN_FREQ = float(sys.argv[3])
MAX_FREQ = float(sys.argv[4])
MIN_INTENSITY = float(sys.argv[5])
MIN_STRENGTH = float(sys.argv[6])
FREQUENCY_NOTE_THRESHOLD = int(sys.argv[7])
MIN_NOTE_DURATION = int(sys.argv[8])

# Config
FREQUENCIES_FILE = "../../src/js/data/frequencies.json"
PRECISION = 3
BPM = 240

# Init
sequence = []
duration = 0

# Get frequency table
json_data = open(FREQUENCIES_FILE)
frequencies = json.load(json_data)

# Mean of list
def mean(data):
  if iter(data) is data:
    data = list(data)
  n = len(data)
  if n < 1:
    return 0
  else:
    return sum(data)/n

def getPitchData(pitch):
  global frequencies
  data = frequencies[0]
  for i, f in enumerate(frequencies):
    hz = float(f['hz'])
    prev_hz = 0
    if i > 0:
      prev_hz = float(frequencies[i-1]['hz'])
    if pitch < hz:
      if prev_hz > 0 and abs(prev_hz-pitch) < abs(hz-pitch):
        data = frequencies[i-1]
      else:
        data = f
      break
  return data

# Add new sequence step
def addToSequence(ms, duration, pitch):
  global sequence
  global MIN_NOTE_DURATION
  global PRECISION

  if duration >= MIN_NOTE_DURATION:
    pd = getPitchData(pitch)
    sequence.append({
      "ms": int(ms),
      "dur": int(duration),
      "hz": round(pitch, PRECISION),
      "note": pd['note'],
      "mid": int(pd['midi'])}
    )

# Retrieve pitch data from Praat file
frames = fileToPitchData(INPUT_FILE)
print "%s frames read from file %s" % (len(frames), INPUT_FILE)

# Generate sequence
pitch_queue = []
start_ms = None
ms = None
start_pitch = 0

for frame in frames:
    ms = int(round(frame["start"] * 1000))
    if start_ms is None:
        start_ms = ms
    candidate = frame["candidates"][0]
    pitch = candidate["frequency"]
    strength = candidate["strength"]
    intensity = frame["intensity"]
    isSilent = pitch < MIN_FREQ or pitch > MAX_FREQ or intensity < MIN_INTENSITY or strength < MIN_STRENGTH
    isValid = not isSilent
    # reached a pause, add previous note queue
    if isSilent and len(pitch_queue) > 0:
      addToSequence(start_ms, ms-start_ms, mean(pitch_queue))
      pitch_queue = []
    # reached a note threshold, add previous note queue
    elif isValid and abs(pitch-start_pitch) > FREQUENCY_NOTE_THRESHOLD and (ms-start_ms) > MIN_NOTE_DURATION and len(pitch_queue) > 0:
      addToSequence(start_ms, ms-start_ms, mean(pitch_queue))
      pitch_queue = []
    # add pitch to note queue
    elif isValid:
      if len(pitch_queue) <= 0:
        start_ms = ms
        start_pitch = pitch
      pitch_queue.append(pitch)
# Add last queue
if (ms-start_ms) > MIN_NOTE_DURATION and len(pitch_queue) > 0:
  addToSequence(start_ms, ms-start_ms, mean(pitch_queue))

def msToBeats(ms):
  global BPM
  bpms = 1.0 * BPM / 60 / 1000
  return bpms * ms

# Write sequence to midi file
if len(sequence) > 0:
  duration = sequence[-1]["ms"] + sequence[-1]["dur"]

  # Create the MIDIFile Object with 1 track
  MyMIDI = MIDIFile(1)

  # Tracks are numbered from zero. Times are measured in beats.
  track = 0
  time = 0

  # Add track name and tempo.
  MyMIDI.addTrackName(track,time,"Track")
  MyMIDI.addTempo(track,time,BPM)

  # Add a note. addNote expects the following information:
  track = 0
  channel = 0
  pitch = 60
  time = 0
  duration = 1
  volume = 100

  # Now add the note.
  for step in sequence:
    time = msToBeats(step["ms"])
    duration = msToBeats(step["dur"])
    pitch = min([int(round(step["mid"])), 255])
    MyMIDI.addNote(track,channel,pitch,time,duration,volume)

  # And write it to disk.
  binfile = open(OUTPUT_FILE, 'wb')
  MyMIDI.writeFile(binfile)
  binfile.close()
  print 'Successfully wrote to file: %s' % OUTPUT_FILE
