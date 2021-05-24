# Google Meet Dice Roller
Dice roller extension for RPG players using Google Meet on Google Chrome or Microsoft Edge (Heyyyy!!! It works!)

If you're seeing this page, probably the Google Meet Dice Roller extension was just installed or updated... Better read these docs to keep up with changes.

## For Microsoft Edge Users

On Edge, after the extension is installed or updated, a white halo may apear surrounding the extension icon in the toolbar. This means you need to give permission to the extension to access Google Meet. To do that, simply click on the icon.

![edge_case](./docs/edge_case.gif)

## Basic Usage

In Google Meet's chat window's text input, use the **/r** or **roll** commands and hit **Enter** to roll dice.

![basic_usage_1](./docs/basic_usage_1.gif)

#### Command Examples:

    roll d6                 (rolls one six sided dice, the number of sides can be any positive integer number)
    
    /r d6                   (rolls one six sided dice, the number of sides can be any positive integer number)
    
    /r d6+10                (rolls one six sided dice and adds 10 to the result)
    
    /r 5d6                  (rolls five six sided dice and sums the results)
    
    /r 5d6+10               (rolls five six sided dice, sums the results and adds 10)
    
    /r 5d6-10               (rolls five six sided dice, sums the results and subtracts 10)

    /r 5d6*10               (rolls five six sided dice, sums the results then multiplies the result by 10)
    
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

You can type any positive integer for the dice "faces". You can use the traditionals **d2, d4, d6, d8, d10, d12, d20, d100** or just funcky stuff like **d37, d23, d145, ETC...**

#### Command Regular Expression
Here is the regular expresion used to validate commands if you're curious...
```javascript
/^((([+-]*)(\d*)d(\d+)(([hl])(\d+))?(([dm])(\d+))?(([\*+-])(\d+))?(([tn])(\d+))?)|\s|(([+-])(\d+)))+$/
```
## User Interface

You can create a **collection** of **dice roll sets** on the user interface. Each set has a **name**, and **the set name should be unique** among the sets in your collection.

Dice roll sets can have many **dice roll commands**. Commands in a set have a **label** that also **should be unique** among commands in the same set. Commands in the dice roll set should be **valid commands** like the ones in the *Command Examples* section above, **without** the **/r** or **roll** parts.

![ui_1](./docs/ui_1.gif)

You can **delete a dice roll set** from your collection using the **"red/minus" delete button**. You can also **delete a dice roll command** from it's set using the **"red/minus" delete button**. A pop up will apear for confirming or canceling deletion on both cases.

You can **edit** a dice roll command using the **green/edit button**. While editing a dice roll command, other buttons will apear for confirming or canceling the changes.

## Using saved dice roll commands

A saved dice roll command can be used in two ways:
- In Google Meet's chat window's text input by typing  **/r** or **roll** followed by **{set name}.{command label}**. So to roll the *attack* command of the *barbarian* set, type **/r barbarian.attack**

![using_saved_1](./docs/using_saved_1.gif)

- Simply use the blue "**roll dice button**" besides the commands while **Google Meet is the active tab**.

![using_saved_2](./docs/using_saved_2.gif)

Probably you've noticed that **the idea is for a dice set to represent a character and the command in the dice set to represent the character's actions**.

## Help, bug reports and feature requests

The best place for help, bug reports and feature requets is the [project's issues page](https://github.com/rafaelvascc/google-meet-dice-roller/issues). **I strongly prefer tracking issues in github instead of reading emails**. Even because other users might help as well.

On the UI's header, there are buttons/links for bug report and feature requests (that leads to the [project's issues page](https://github.com/rafaelvascc/google-meet-dice-roller/issues)) and a help/docs button that leads to this README.md file.

## Donations

I created this extension primary for me and my RPG group, then I decided to distribute it for free because "why not?". 

I have no intention to charge for it's use. First because only a very small amount of people would pay for it and a lot of RPG players would like to use it but can't or won't pay. So I just prefer to leave it free and let everyone enjoy.

Second, I don't want to turn something I made for myself, for fun and to mess with React, to turn into a side/second job.

If you liked the extension and are feeling generous, on the UI's header there is a **Donate** button. You may send me money for a coffee with it or just use the "donate" button bellow. If you're feeling REALLY generous, you can send me enough for a RTX 3080. :grin:

[![btn_donate_LG.gif](./docs/btn_donate_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=8P3F8ZGPH9L34)

Since I'm too lazy to see emails and thank each one that donated, I will leave a great **"Thanks"** here in advance.

# Changelog

## [1.0.0] - 2021-05-23

### Added
- Added user interface for creating dice roll sets
- Added "multiply" option to dice roll calculations 

### Changed
- Better docs

## [0.0.0.2] - 2020-07-22

### Fixes
- Fixed subtracting constant value in commands like /r 2d6-1 

# Planned features (no date yet)
- User variables to dice roll sets
- Backup/Export and Restore/Import buttons

# Tech debt
- Make button with tooltip a React component 