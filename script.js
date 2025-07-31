const boardContainer=document.getElementById('sudoku-board');
const generateBtn=document.getElementById('generate-btn');
const resetBtn=document.getElementById('reset-btn');
const solveBtn=document.getElementById('solve-btn');
const difficultySelect=document.getElementById('difficulty');
const validateBtn=document.getElementById('validate-btn');
const validationResult=document.getElementById('validation-result');

// let board=[
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ]

let board=Array.from({length: 9}, () => Array(9).fill(0));

let timeInterval=null;
let secondsElapsed=0;

const puzzle={
    custom: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    easy: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    medium: [
        [0, 0, 0, 2, 6, 0, 7, 0, 1],
        [6, 8, 0, 0, 7, 0, 0, 9, 0],
        [1, 9, 0, 0, 0, 4, 5, 0, 0],
        [8, 2, 0, 1, 0, 0, 0, 4, 0],
        [0, 0, 4, 6, 0, 2, 9, 0, 0],
        [0, 5, 0, 0, 0, 3, 0, 2, 8],
        [0, 0, 9, 3, 0, 0, 0, 7, 4],
        [0, 4, 0, 0, 5, 0, 0, 3, 6],
        [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    hard: [
        [0, 0, 0, 0, 0, 0, 0, 1, 2],
        [0, 0, 0, 0, 0, 0, 7, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 5, 0, 9, 0, 0, 0],
        [0, 0, 0, 0, 6, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 9, 2, 0, 0, 0, 0, 0, 0],
        [8, 4, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
}

function createBoard(){
    boardContainer.innerHTML='';
    for(let row=0;row<9;row++){
        for(let col=0;col<9;col++){
            const input=document.createElement('input');
            input.type='text';
            input.maxLength=1;
            input.className='cell';
            input.dataset.row=row;
            input.dataset.col=col;

            if(row%3===0) input.style.borderTop="2px solid #333";
            if(col%3===0) input.style.borderLeft="2px solid #333";
            if(col===8) input.style.borderRight="2px solid #333";
            if(row===8) input.style.borderBottom="2px solid #333";

            if(board[row][col]!=0)
            {
                input.value=board[row][col];
                input.classList.add('fixed');
                input.disabled=true;
            }

            input.addEventListener('input', (e) => {
                const val=parseInt(e.target.value);
                if(val>=1 && val<=9){
                    board[row][col]=val;
                }
                else {
                    e.target.value='';
                }
            });
            boardContainer.appendChild(input);     
        }
    }
}

generateBtn.addEventListener('click', () => {
    validationResult.innerText='';
    const difficulty=difficultySelect.value;
    board=JSON.parse(JSON.stringify(puzzle[difficulty]));
    createBoard();
    startTimer();
});

function startTimer(){
    if(timeInterval) clearInterval(timeInterval);
    secondsElapsed=0;
    updateTimer();
    timeInterval=setInterval(() => {
        secondsElapsed++;
        updateTimer()
    }, 1000);
}

function updateTimer(){
    const timerElement=document.getElementById('timer');
    timerElement.textContent=`⏱ ${formatTime(secondsElapsed)}`;
}

function formatTime(seconds){
    const min=Math.floor(seconds/60).toString().padStart(2, '0');
    const sec=Math.floor(seconds%60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

function stopTimer(){
    if(timeInterval) clearInterval(timeInterval);
    timeInterval=null;
}

solveBtn.addEventListener('click', () => {
    validationResult.innerText='';
    const difficulty=difficultySelect.value;
    board=JSON.parse(JSON.stringify(puzzle[difficulty]));
    solveSudoku(board);
    createBoard();
    stopTimer();
});

function solveSudoku(board){
    for(let row=0;row<9;row++){
        for(let col=0;col<9;col++)
        {
            if(board[row][col]==0)
            {
                for(let num=1;num<=9;num++){
                    if(isValid(board, row, col, num)) {
                        board[row][col]=num;
                        if(solveSudoku(board)) return true;
                        board[row][col]=0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(board, row, col, num){
    // check row
    for(let i=0;i<9;i++) {
        if(i===row) continue;
        if(board[i][col]===num) return false;
    }

    // check col
    for(let i=0;i<9;i++) {
        if(i===col) continue;
        if(board[row][i]===num) return false;
    }

    // check in 3x3 grid
    let startOfGridRow=3*Math.floor(row/3);
    let startOfGridCol=3*Math.floor(col/3);
    let endOfGridRow=startOfGridRow+3;
    let endOfGridCol=startOfGridCol+3;
    for(let i=startOfGridRow;i<endOfGridRow;i++) {
        for(let j=startOfGridCol;j<endOfGridCol;j++) {
            if(i===row && j===col) continue;
            if(board[i][j]===num) return false;
        }
    }
    return true;
}

resetBtn.addEventListener('click', () => {
    validationResult.innerText='';
    stopTimer();
    board=JSON.parse(JSON.stringify(puzzle[difficultySelect.value]));
    createBoard();
    secondsElapsed=0;
    updateTimer();
});

validateBtn.addEventListener('click', () => {
    validateInput();
});

function validateInput() {
    const input=document.querySelectorAll('.cell input');
    input.forEach((input, index) => {
        const row=Math.floor(index/9);
        const col=index%9;
        const val=parseInt(input.value);
        if(val>=1 && val<=9) {
            board[row][col]=val;
        }
        else {
            board[row][col]=0;
        }
    });

    for(let row=0;row<9;row++) {
        for(let col=0;col<9;col++) {
            if(board[row][col]!=0) {
                if(!isValid(board, row, col, board[row][col])) {
                    validationResult.innerText=`❌ Incorrect Input at row: ${row}, col:${col}`;
                    return false;

                }
            }
        }
    }
    validationResult.innerText=`✅ Validated Successfully!`;
    return true;
}
createBoard();
updateTimer();