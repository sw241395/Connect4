const COLUMN_COUNT = 7;
const ROW_COUNT = 6;

const PLAYER = 1;
const AI = 2;

const MAX_ITERATIONS = 5

var board = [[0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0]];


// Function to drop a token into the board
function drop(col_numb)
{
    // get column
    let player_col_name = "col" + col_numb;
    let player_rows = document.getElementById(player_col_name).getElementsByClassName("cell");

    // Add token to the bottom of the column if empty
    let exit = true;
    for (let row = 0; row < player_rows.length; row++)
    {
        if (!player_rows[row].classList.contains("p1") && !player_rows[row].classList.contains("p2"))
        {
            player_rows[row].classList.add("p1");
            board[ROW_COUNT - 1 - row][col_numb] = PLAYER;
            
            exit = false;
            
            break;
        }
    }
    // exit code if no more rows can be added to the column
    if (exit)
        return

    // Check to see if the player has Won
    if (check())
    {
        // get AI to place block
        let ai_turn = MinMax(board, AI, 1);

        // Add AI token to board
        let ai_col_name = "col" + ai_turn[0];
        let ai_rows = document.getElementById(ai_col_name).getElementsByClassName("cell");
        for (let row = 0; row < ai_rows.length; row++)
        {
            if (!ai_rows[row].classList.contains("p1") && !ai_rows[row].classList.contains("p2"))
            {
                ai_rows[row].classList.add("p2");
                board[ROW_COUNT - 1 - row][ai_turn[0]] = AI;
                break;
            }
        }

        // Check to see if the AI has Won
        check();
    }
}


// Check tho board and output a message if anyone has won
function check()
{
    let check = check_board(board);

    if (check == PLAYER)
    {
        alert('CONGRATULATION, YOU WIN!');
        disable_cols();
        return false;
    }
    else if (check == AI)
    {
        alert('Sorry you lost, please try again');
        disable_cols();
        return false;
    }

    // Check to see if the board is a draw
    let draw = true;
    outside_loop:
    for (let row = 0; row <  ROW_COUNT; row++)
    {
        for (let col = 0; col < COLUMN_COUNT; col++)
        {
            if (board[row][col] == 0)
            {
                draw = false;
                break outside_loop;
            }
        }
    }
    if (draw)
    {
        alert('DRAW');
        disable_cols();
        return false;
    }

    return true;
}


// Function to disable the ability to add in more tokens
function disable_cols()
{
    let columns = document.getElementsByClassName('col')
    for (let column = 0; column < columns.length; column++)
        columns[column].onclick = '#';
    
}


// Function to reset the page
function reset()
{
    window.location.reload();
}


// Min Max Algorithm to look ahead x number of moves
function MinMax(temp_board, player, iteration)
{
    let choices = generate_next_moves(temp_board, player)

    if (iteration < MAX_ITERATIONS)
    {
        let scores = {}

        for (const [key, val] of Object.entries(choices))
        {
            let temp_iteration = iteration + 1;
            let check = check_board(val);

            if (check == AI)
            {
                scores[key] = 14;
                break;
            }
            else if (check == PLAYER)
            {
                scores[key] = -14;
                break;
            }
            else if (player == AI)
            {
                output = MinMax(val, PLAYER, temp_iteration);
            }
            else
            {
                output = MinMax(val, AI, temp_iteration);
            }
            scores[key] = output[1];
        }
        
        // After loop, output the next output for the AI
        if (player == AI)
        {
            let max_value = Math.max(...Object.values(scores));

            // get the keys for where the values is equal to the max value
            let optimum_choices = [];
            Object.entries(scores).forEach(([key, value]) => {
                if (value == max_value)
                    optimum_choices.push(key);
            });
            
            // Get random item from list
            let optimum_choice = optimum_choices[Math.floor(Math.random()*optimum_choices.length)];

            return [optimum_choice, max_value]   
        }
        else
        {
            let min_value = Math.min(...Object.values(scores));

            // get the keys for where the values is equal to the max value
            let optimum_choices = [];
            Object.entries(scores).forEach(([key, value]) => {
                if (value == min_value)
                    optimum_choices.push(key);
            });
            
            // Get random item from list
            let optimum_choice = optimum_choices[Math.floor(Math.random()*optimum_choices.length)];

            return [optimum_choice, min_value]  
        }
    }
    else
    {
        // Calculate score of 7 outcomes 
        let score = 0
        for (const [key, val] of Object.entries(choices))
        {
            let check = check_board(val);
            if (check == PLAYER)
                score++;
            else if (check == AI)
                score--;
        } 

        return [0, score];
    }
}


// Function to generate where the next token could be placed
function generate_next_moves(temp_board, player)
{
    let choices = {};

    for (let col = 0; col < COLUMN_COUNT; col++)
    {
        // Create clone 
        let board_copy = temp_board.map(function(arr) {
            return arr.slice();
        });

        for (let row = 0; row < ROW_COUNT; row++)
        {
            if (board_copy[ROW_COUNT - 1 - row][col] == 0)
            {
                board_copy[ROW_COUNT - 1 - row][col] = player;
                choices[col] = board_copy;
                break
            }
        }
    }

    return choices;
}


// Function to check the board to see if anyone has won
function check_board(temp_board)
{
    // check horizontal
    for (let c = 0; c < COLUMN_COUNT - 3; c++)
    {
        for (let r = 0; r < ROW_COUNT; r++)
        {
            if (temp_board[r][c] == AI && temp_board[r][c+1] == AI && temp_board[r][c+2] == AI && temp_board[r][c+3] == AI)
                return AI;
            else if (temp_board[r][c] == PLAYER && temp_board[r][c+1] == PLAYER && temp_board[r][c+2] == PLAYER && temp_board[r][c+3] == PLAYER)
                return PLAYER;
        }
    }

    // check vertical
    for (let c = 0; c < COLUMN_COUNT; c++)
    {
        for (let r = 0; r < ROW_COUNT - 3; r++)
        {
            if (temp_board[r][c] == AI && temp_board[r+1][c] == AI && temp_board[r+2][c] == AI && temp_board[r+3][c] == AI)
                return AI;
            else if (temp_board[r][c] == PLAYER && temp_board[r+1][c] == PLAYER && temp_board[r+2][c] == PLAYER && temp_board[r+3][c] == PLAYER)
                return PLAYER;
        }
    }

    // Check diagonal
    for (let c = 0; c < COLUMN_COUNT - 3; c++)
    {
        for (let r = 0; r < ROW_COUNT - 3; r++)
        {
            if (temp_board[r][c] == AI && temp_board[r+1][c+1] == AI && temp_board[r+2][c+2] == AI && temp_board[r+3][c+3] == AI)
                return AI;
            else if (temp_board[r][c] == PLAYER && temp_board[r+1][c+1] == PLAYER && temp_board[r+2][c+2] == PLAYER && temp_board[r+3][c+3] == PLAYER)
                return PLAYER;
        }
    }

    // Check other diagonal
    for (let c = 0; c < COLUMN_COUNT - 3; c++)
    {
        for (let r = 3; r < ROW_COUNT; r++)
        {
            if (temp_board[r][c] == AI && temp_board[r-1][c+1] == AI && temp_board[r-2][c+2] == AI && temp_board[r-3][c+3] == AI)
                return AI;
            else if (temp_board[r][c] == PLAYER && temp_board[r-1][c+1] == PLAYER && temp_board[r-2][c+2] == PLAYER && temp_board[r-3][c+3] == PLAYER)
                return PLAYER;
        }
    }
}



