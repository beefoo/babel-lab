var NOTE_FREQUENCIES = [
  {
  note: "C0",
  hz: 16.352,
  midi: 12
  },{
  note: "C#0",
  hz: 17.324,
  midi: 13
  },{
  note: "D0",
  hz: 18.354,
  midi: 14
  },{
  note: "D#0",
  hz: 19.445,
  midi: 15
  },{
  note: "E0",
  hz: 20.602,
  midi: 16
  },{
  note: "F0",
  hz: 21.827,
  midi: 17
  },{
  note: "F#0",
  hz: 23.125,
  midi: 18
  },{
  note: "G0",
  hz: 24.5,
  midi: 19
  },{
  note: "G#0",
  hz: 25.957,
  midi: 20
  },{
  note: "A0",
  hz: 27.5,
  midi: 21
  },{
  note: "A#0",
  hz: 29.135,
  midi: 22
  },{
  note: "B0",
  hz: 30.868,
  midi: 23
  },{
  note: "C1",
  hz: 32.703,
  midi: 24
  },{
  note: "C#1",
  hz: 34.648,
  midi: 25
  },{
  note: "D1",
  hz: 36.708,
  midi: 26
  },{
  note: "D#1",
  hz: 38.891,
  midi: 27
  },{
  note: "E1",
  hz: 41.203,
  midi: 28
  },{
  note: "F1",
  hz: 43.654,
  midi: 29
  },{
  note: "F#1",
  hz: 46.249,
  midi: 30
  },{
  note: "G1",
  hz: 48.999,
  midi: 31
  },{
  note: "G#1",
  hz: 51.913,
  midi: 32
  },{
  note: "A1",
  hz: 55,
  midi: 33
  },{
  note: "A#1",
  hz: 58.27,
  midi: 34
  },{
  note: "B1",
  hz: 61.735,
  midi: 35
  },{
  note: "C2",
  hz: 65.406,
  midi: 36
  },{
  note: "C#2",
  hz: 69.296,
  midi: 37
  },{
  note: "D2",
  hz: 73.416,
  midi: 38
  },{
  note: "D#2",
  hz: 77.782,
  midi: 39
  },{
  note: "E2",
  hz: 82.407,
  midi: 40
  },{
  note: "F2",
  hz: 87.307,
  midi: 41
  },{
  note: "F#2",
  hz: 92.499,
  midi: 42
  },{
  note: "G2",
  hz: 97.999,
  midi: 43
  },{
  note: "G#2",
  hz: 103.826,
  midi: 44
  },{
  note: "A2",
  hz: 110,
  midi: 45
  },{
  note: "A#2",
  hz: 116.541,
  midi: 46
  },{
  note: "B2",
  hz: 123.471,
  midi: 47
  },{
  note: "C3",
  hz: 130.813,
  midi: 48
  },{
  note: "C#3",
  hz: 138.591,
  midi: 49
  },{
  note: "D3",
  hz: 146.832,
  midi: 50
  },{
  note: "D#3",
  hz: 155.563,
  midi: 51
  },{
  note: "E3",
  hz: 164.814,
  midi: 52
  },{
  note: "F3",
  hz: 174.614,
  midi: 53
  },{
  note: "F#3",
  hz: 184.997,
  midi: 54
  },{
  note: "G3",
  hz: 195.998,
  midi: 55
  },{
  note: "G#3",
  hz: 207.652,
  midi: 56
  },{
  note: "A3",
  hz: 220,
  midi: 57
  },{
  note: "A#3",
  hz: 233.082,
  midi: 58
  },{
  note: "B3",
  hz: 246.942,
  midi: 59
  },{
  note: "C4",
  hz: 261.626,
  midi: 60
  },{
  note: "C#4",
  hz: 277.183,
  midi: 61
  },{
  note: "D4",
  hz: 293.665,
  midi: 62
  },{
  note: "D#4",
  hz: 311.127,
  midi: 63
  },{
  note: "E4",
  hz: 329.628,
  midi: 64
  },{
  note: "F4",
  hz: 349.228,
  midi: 65
  },{
  note: "F#4",
  hz: 369.994,
  midi: 66
  },{
  note: "G4",
  hz: 391.995,
  midi: 67
  },{
  note: "G#4",
  hz: 415.305,
  midi: 68
  },{
  note: "A4",
  hz: 440,
  midi: 69
  },{
  note: "A#4",
  hz: 466.164,
  midi: 70
  },{
  note: "B4",
  hz: 493.883,
  midi: 71
  },{
  note: "C5",
  hz: 523.251,
  midi: 72
  },{
  note: "C#5",
  hz: 554.365,
  midi: 73
  },{
  note: "D5",
  hz: 587.33,
  midi: 74
  },{
  note: "D#5",
  hz: 622.254,
  midi: 75
  },{
  note: "E5",
  hz: 659.255,
  midi: 76
  },{
  note: "F5",
  hz: 698.456,
  midi: 77
  },{
  note: "F#5",
  hz: 739.989,
  midi: 78
  },{
  note: "G5",
  hz: 783.991,
  midi: 79
  },{
  note: "G#5",
  hz: 830.609,
  midi: 80
  },{
  note: "A5",
  hz: 880,
  midi: 81
  },{
  note: "A#5",
  hz: 932.328,
  midi: 82
  },{
  note: "B5",
  hz: 987.767,
  midi: 83
  },{
  note: "C6",
  hz: 1046.502,
  midi: 84
  },{
  note: "C#6",
  hz: 1108.731,
  midi: 85
  },{
  note: "D6",
  hz: 1174.659,
  midi: 86
  },{
  note: "D#6",
  hz: 1244.508,
  midi: 87
  },{
  note: "E6",
  hz: 1318.51,
  midi: 88
  },{
  note: "F6",
  hz: 1396.913,
  midi: 89
  },{
  note: "F#6",
  hz: 1479.978,
  midi: 90
  },{
  note: "G6",
  hz: 1567.982,
  midi: 91
  },{
  note: "G#6",
  hz: 1661.219,
  midi: 92
  },{
  note: "A6",
  hz: 1760,
  midi: 93
  },{
  note: "A#6",
  hz: 1864.655,
  midi: 94
  },{
  note: "B6",
  hz: 1975.533,
  midi: 95
  },{
  note: "C7",
  hz: 2093.005,
  midi: 96
  },{
  note: "C#7",
  hz: 2217.461,
  midi: 97
  },{
  note: "D7",
  hz: 2349.318,
  midi: 98
  },{
  note: "D#7",
  hz: 2489.016,
  midi: 99
  },{
  note: "E7",
  hz: 2637.02,
  midi: 100
  },{
  note: "F7",
  hz: 2793.826,
  midi: 101
  },{
  note: "F#7",
  hz: 2959.955,
  midi: 102
  },{
  note: "G7",
  hz: 3135.963,
  midi: 103
  },{
  note: "G#7",
  hz: 3322.438,
  midi: 104
  },{
  note: "A7",
  hz: 3520,
  midi: 105
  },{
  note: "A#7",
  hz: 3729.31,
  midi: 106
  },{
  note: "B7",
  hz: 3951.066,
  midi: 107
  }
];
