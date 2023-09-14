import {unplayedSquare} from './Oxo-game.js'

const wins = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ]

export function computerChooseMoveOnOxoGame(game){

  const me= game.playerOnMove

  const playables= wins
          .map(line => {
            const lineState={me:0, them:0, open:0, canPlayAt:0}
            line.map(cell=> {
              switch(game.boardModel[cell]){
                case me: lineState.me+=1; break;
                case unplayedSquare:
                  lineState.open+=1;
                  lineState.canPlayAt= lineState.canPlayAt || cell
                  break;
                default: lineState.them += 1;
              }
            })
            return lineState
          })
          .filter(lineState=> lineState.canPlayAt)

  playables.sort( (a,b) => a.open - b.open )
  //console.info(playables)

  return playables[0].canPlayAt
}

export function computerChooseMoveOnUltimateOxoGame(metaGame){

  const boardToPlay= (metaGame.nextBoard===0) ? chooseABoard() : metaGame.nextBoard

  if(boardToPlay===0) return {board:0, cell:0}
  return {
    board: boardToPlay,
    square: computerChooseMoveOnOxoGame(metaGame.games[boardToPlay])
  }

  function chooseABoard(){
    if(metaGame.nextBoard !== 0)return metaGame.nextBoard
    ;
    const playables= metaGame.games.filter(g => ! g.winLine)
    return Math.ceil(Math.random() * playables.length)
  }
}

export function registerComputerPlayerToObserveUiMoveQueue(
        metaGame,
        gameStewardIsHumanOrComputer,
        oxoBoardsNA,
        uiMoveQueue)
{
    uiMoveQueue.addObserver("ComputerPlayer", function(event){
    if(event.method !== 'push')return;
    //
    console.info("computer player heard",event)
    //
    if(gameStewardIsHumanOrComputer(metaGame.playerOnMove)==='computer'){
      const {board,square}= computerChooseMoveOnUltimateOxoGame(metaGame)
      console.info("computer player will play", board, metaGame.playerOnMove, square )
      oxoBoardsNA[board].clickSquare(square)
    }
  })
}