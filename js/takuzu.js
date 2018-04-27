"use strict";
var GRID_SIZE = 8;
var MAX_ITER = 30;

var SYM_HIDDEN = 1;
var SYM_ZERO = 2;
var SYM_ONE = 3;

function balanced(line) {
    var zeroes = 0;
    var ones = 0;
    for (var i = 0; i < line.length; i += 1) {
        if (line[i] === SYM_ZERO) {
            zeroes += 1;
        } else if (line[i] === SYM_ONE) {
            ones += 1;
        } else {
            alert("PROBLEM");
        }
    }
    return (zeroes === ones);
}

function consect(line){
    var consect_zeroes = 0;
    var consect_ones = 0;
    for (var i = 0; i < line.length; i += 1){
        if (line[i] === SYM_ZERO) {
            consect_zeroes++;
            consect_ones = 0;
        } else if (line[i] === SYM_ONE){
            consect_zeroes = 0;
            consect_ones++;
        } else {
            alert("PROBLEM!");
        }
        if (consect_ones > 2 || consect_zeroes > 2) {
            return false;
        }
    }
    return true;
}

function valid_takuzu_line(line){
    return balanced(line) && consect(line);
}

function countChar(line, char){
    var count = 0;
    for(var i = 0; i < line.length; i += 1){
        if (line[i] === char){
            count += 1;
        }
    }
    return count;
}

function random_bit()
{
    var bit;
    if (Math.random() * 2 > 1){
        bit = SYM_ONE;
    } else {
        bit = SYM_ZERO;
    }
    return bit; 
}

function lower_count_bit(list){
    if(countChar(list,SYM_ONE) > countChar(list,SYM_ZERO)){
        return SYM_ZERO;
    } else {
        return SYM_ONE;
    }
}

function gen_valid_takuzu_line(line_size){
    var return_list = [];
    if (line_size === 0) {
        return return_list;
    }
    for(var i = 0; i < line_size; i += 1){
        if (Math.abs(countChar(return_list, SYM_ONE) - countChar(return_list, SYM_ZERO)) > 0){
            return_list.push(lower_count_bit(return_list));
        } else if (i > 1 && return_list[i-2] === return_list[i-1]) {
            if(return_list[i-1] == SYM_ONE){
                return_list.push(SYM_ZERO);
            } else {
                return_list.push(SYM_ONE);
            }
        } else {
            return_list.push(random_bit());
        }
    }
    return return_list;
}

// simple function that counts ocurrances of given array in an array of arrays
function countSame(lines, line) {
    var count = 0;
    for (var i = 0; i < lines.length; i += 1) {
        var same = true;
        for (var j = 0; j < lines[i].length; j += 1) {
            if (lines[i][j] !== line[j]) {
                same = false;
                break;
            }
        }
        if (same === true) {
            count += 1;
        }
    }
    return count;
}

function genGame() {
    var game = gen_game_from_lines(GRID_SIZE);
    var table = document.getElementById("game");
    for (var i = 0; i < GRID_SIZE; i += 1) {
        var rowCurr = table.rows[i];
        for (var j = 0; j < GRID_SIZE; j += 1) {
            rowCurr.cells[j].innerHTML = game[i][j];
        }
    }
}

function valid_takuzu(lines){
    var solveAll = true;
    var copy_lines = lines.slice();
    var cols = get_cols(copy_lines);
    for (var i = 0; i < copy_lines.length; i += 1) {
        if (!balanced(copy_lines[i]) || !consect(copy_lines[i]) || countSame(copy_lines, copy_lines[i]) > 1) {
            solveAll = false;
            break;
        }
    }
    for (var i = 0; i < cols.length; i += 1){
        if (!balanced(cols[i]) || !consect(cols[i]) || countSame(cols, cols[i]) > 1) {
            solveAll = false;
            break;
        }
    }
    return solveAll;
}

function gen_uniq_valid_lines(lines, line_size){
    var count = 0;
    var returned = [];
    while (count < lines) {
        var curr = gen_valid_takuzu_line(line_size);
        if(countSame(returned, curr) < 1){
            returned.push(curr);
        }
        count += 1;
    }
    return returned;
}

function get_cols(grid){
    var cols = [];
    for(var i = 0; i < grid.length; i += 1){
        var col = [];
        for(var j = 0; j < grid[0].length; j += 1){
            col.push(grid[j][i]);
        }
        cols.push(col);
    }
    return cols;
}

function gen_game_from_lines(grid_size){
    var no_lines = Math.pow(2, grid_size);  
    var lines = gen_uniq_valid_lines(no_lines, grid_size)
    var valid = false;
    var curr_grid;
    var count = 0;
    while(!valid){
        curr_grid = [];
        for (var i = 0; i < grid_size; i++){
            var curr = Math.floor(Math.random() * lines.length-1) + 1;
            if(countSame(curr_grid, lines[curr]) === 0){
                curr_grid.push(lines[curr]);
            } else {
                i -= 1;
            }
        }
        valid = valid_takuzu(curr_grid);
    }
    return curr_grid;
}

// takuzu rules
// no same row
// no same column
// each lines is balanced
// no more than 2 consectutive

function can_be_made_balanced(line){
    if(countChar(line, SYM_HIDDEN) <= Math.floor(line.length/2)){
        console.log("TRUE");        
        return true;
    } else {
        console.log("FALSE");
        return false;
    }
}

function clone_grid(grid){
    var clone = [];
    for(var i = 0; i < grid.length; i++){
        clone.push(grid[i].slice());
    }
    return clone;
}

// TODO:not sure if need dedicated grid clone function
function obscure_sol(grid, max_iter){
    var curr = clone_grid(grid);
    for(var i = 0; i < max_iter; i++){
        var prev = clone_grid(grid);
        var x = Math.floor(Math.random() * grid.length - 1) + 1;
        var y = Math.floor(Math.random() * grid.length - 1) + 1;
        curr[x][y] = SYM_HIDDEN;
        if(!(can_be_made_balanced(curr[x]) || can_be_made_balanced(get_cols(curr)[y]))){
            curr = prev;
        }
    }
    return curr;
}

function gen_grid(grid_size){
    // generate double list of grid
    var grid = gen_game_from_lines(grid_size);
    //console.log(grid);
    //console.log(valid_takuzu(grid));
    grid = obscure_sol(grid, Math.pow(2, grid.length+2));
    // convert for use
    var grid_obj = new Object();
    for(var i = 0; i < grid_size; i += 1){
        var grid_row = new Object();
        for(var j = 0; j < grid_size; j += 1){
            grid_row[j] = grid[i][j];
        }
        grid_obj[i] = grid_row;
    }
    // testing
    //grid_obj[0][0] = 1;
    return grid_obj;
}