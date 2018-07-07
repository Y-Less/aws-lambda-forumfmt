# Forum Enhancer

## Introduction

This Greasemonkey/Tampermoney script allows you to write forum posts in markdown, with full pawn syntax highlighting automatically.  It also supports ctrl+enter to submit, and tabbing within text for indentation.

## Download

https://openuserjs.org/scripts/y-less/SAMP_Forum_Enhancer

Note that this is a "user script", a script that enhances a website from the browser directly.  Thus you will need one of the addons used to run these scripts:

Firefox (tested): https://addons.mozilla.org/en-GB/firefox/addon/tampermonkey/

Chrome (not tested): https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo

For more information and other browsers see this link:

https://openuserjs.org/about/Userscript-Beginners-HOWTO

## Background

Southclaws got sick of writing BB code (and who can blame him), so wrote (forumfmt)[https://github.com/Southclaws/forumfmt] to convert markdown in to BB code.  This was originally written as an offline tool to convert documentation from github in to something that could be posted on the forums.  However, I decided I wanted it more integrated so wrote this script to intercept post submissions, translate the text with the tool, and then submit that adjusted code instead.

What's wrong with BB code?  Well simply it isn't widely used.  If you write documentation on github, you'll use markdown.  If you write things on discord, you use markdown.  It makes sense to be able to use the same code everywhere.  Also, the `[[b][/b]pawn]` tags are broken on the forums, and didn't support common keywords like `foreach` anyway.

## Usage

Usage it very simple.  When you make a post on the forums, use markdown instead of BB code.  When you click `post`, or hit ctrl+enter (because `tab` no longer moves to the control) the text is converted and submitted.

You can also use `tab` as in code editors - including block indentation and unindentation of multiple selected lines.

## Markdown

For more information on markdown, there are hundreds of sites with more documentation.  But for a brief example, **this**:

    # Main heading
    
    ## Second heading
    
    ```
    code
    ```
    
    ```pawn
    // syntax-highlighted PAWN code (with extensions)
    foreach (new i : Player)
    {
    	if (i > 5)
    		printf("%d", i);
    }
    ```
    
    * **Bold list item 1**
    * *Italic list item 2*
    * List item 3 with `inline code`

**Gives**:

# Main heading

## Second heading

```
code
```

```pawn
// syntax-highlighted PAWN code (with extensions)
foreach (new i : Player)
{
	if (i > 5)
		printf("%d", i);
}
```

* **Bold list item 1**
* *Italic list item 2*
* List item 3 with `inline code`

