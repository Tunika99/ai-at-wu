#!/bin/bash
# Remotion launches this instead of Chrome directly, so we can add flags it
# has no option for: without a GPU process Chrome no longer crashes mid-render.
exec "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "$@" --disable-gpu --disable-gpu-compositing
