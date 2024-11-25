#!/bin/bash

SESSION="nonogram"

tmux has-session -t $SESSION 2>/dev/null

if [ $? != 0 ]; then 
  WINDOW="editor"
  tmux new-session -d -s $SESSION -n $WINDOW

  tmux send-keys -t $SESSION:$WINDOW "nvim" C-m

  WINDOW="terminal"
  tmux new-window -t $SESSION -n $WINDOW

  WINDOW="servers"
  tmux new-window -t $SESSION -n $WINDOW
  tmux send-keys -t $SESSION:$WINDOW "cd api; npm run dev" C-m

  tmux split-window
  tmux send-keys -t $SESSION:$WINDOW "cd app; npm start" C-m

  WINDOW="mongodb"
  tmux new-window -t $SESSION -n $WINDOW
  tmux send-keys -t $SESSION:$WINDOW "docker compose up -d mongodb" C-m
  tmux send-keys -t $SESSION:$WINDOW \
    "docker exec -ti nonogram-mongodb mongosh nonogram \
      -u stevan -p root --authenticationDatabase admin" 

  WINDOW="docker"
  tmux new-window -t $SESSION -n $WINDOW
  tmux send-keys -t $SESSION:$WINDOW "ld" C-m

  WINDOW="git"
  tmux new-window -t $SESSION -n $WINDOW
  tmux send-keys -t $SESSION:$WINDOW "lg" C-m

  tmux select-window -t $SESSION:1
fi

tmux attach-session -t $SESSION
