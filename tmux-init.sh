#!/bin/bash

SESSION="nonogram"

tmux has-session -t $SESSION 2>/dev/null

if [ $? != 0 ]; then 
  WINDOW="editor"
  tmux new-session -d -s $SESSION -n $WINDOW

  tmux send-keys -t $SESSION:$WINDOW "nvim" C-m

  WINDOW="terms"
  tmux new-window -t $SESSION -n $WINDOW
  tmux send-keys -t $SESSION:$WINDOW "cd api; npm run dev" C-m

  tmux split-window
  tmux send-keys -t $SESSION:$WINDOW "cd app; npm start" C-m

  WINDOW="mongodb"
  tmux new-window -t $SESSION -n $WINDOW
  tmux send-keys -t $SESSION:$WINDOW "docker compose up -d mongodb" C-m
  tmux send-keys -t $SESSION:$WINDOW \
    "sleep 5; docker exec -ti nonogram-mongodb mongosh nonogram \
      -u stevan -p root --authenticationDatabase admin" C-m

  tmux select-window -t $SESSION:1
fi

tmux attach-session -t $SESSION
