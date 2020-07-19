# Google Meet Dice Roller
Dice roller chrome extension for RPG players using Google Meet

Use the /r or roll command in the chat window's text input box and hit Enter to roll dice (clicking the send message button isn't working at the moment).

Examples:

    roll d6                 (rolls one six sided dice, the number of sides can be any positive integer number)
    
    /r d6                   (rolls one six sided dice, the number of sides can be any positive integer number)
    
    /r d6+10                (rolls one six sided dice and adds 10 to the result)
    
    /r 5d6                  (rolls five six sided dice and sums the results)
    
    /r 5d6+10               (rolls five six sided dice, sums the results and adds 10)
    
    /r 5d6-10               (rolls five six sided dice, sums the results and subtracts 10)
    
    /r 5d6h2                (rolls five six sided dice and sums the results of the two highest values. "h" stands for "Highest")
    
    /r 5d6l2                (rolls five six sided dice and sums the results of the two lowest values. "l" stands for "Lowest")
    
    /r 5d6h2+10             (rolls five six sided dice, sums the results of the two highest values and adds 10)
    
    /r 5d6d3                (rolls five six sided dice, sums the results then counts how many results are equal or higher than 3. "d" stands for "Difficulty")
    
    /r 5d6m3                (rolls five six sided dice, sums the results then counts how many results are equal or lower than 3. "m" stands for "liMit")
    
    /r 5d6t20               (rolls five six sided dice, sums the results and shows SUCCESS if the sum is equal or higher than 20. "t" stands for "Target")
    
    /r 5d6n20               (rolls five six sided dice, sums the results and shows SUCCESS if the sum is equal or lower than 20. "n" stands for "Negate")
    
    /r 5d6+10t20            (rolls five six sided dice, sums the results, adds 10, and shows SUCCESS if the sum is equal or higher than 20)
    
    /r 5d6+10n20            (rolls five six sided dice, sums the results, adds 10, and shows SUCCESS if the sum is equal or lower than 20)
    
    /r 5d6h2+10t20          (rolls five six sided dice, sums the results of the two highest values, adds 10, and shows SUCCESS if the sum is equal or higher than 20)
    
    /r 5d6l2+10t20          (rolls five six sided dice, sums the results of the two lowest values, adds 10, and shows SUCCESS if the sum is equal or lower than 20)
    
    /r 2d6 +3d12 -4d4 +10   (rolls and sums the results of two six sided dice, adds the sum of results of three twelve sided dice, subtracts the sum of result of four four sided dice, then adds 10 to the final result)
