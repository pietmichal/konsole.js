# konsole.js
Command line/Terminal like application in browser.
You can use and create commands and (in the future) add them to repository to make them available to download.

# [CHECK HOW IT WORKS HERE](http://harsay.github.io/konsole.js)

Current version: 0.1.3

## How to use
Working example:
``` html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>konsole.js</title>
    </head>
    <style>
        html, body {
          height: 100%;
          padding: 0;
          margin: 0;
        }
        #console {
            width: 100%;
            height: 100%;
            background: black;
            color: white;
            font-family: monospace;
            font-size: 14px;
            margin: 0 auto;
        }
    </style>
    <body>
        <div id="console"></div>
        <script src="konsole.js"></script>
        <script>konsole.init("#console")</script>
    </body>
</html>
```

## Available commands
| command | arguments | description |
| ------- | --------- | ----------- |
| help    | command   | Prints information about given command, without arguments shows all commands |
| version | -         | Shows konsole.js version |
| print   | text      | Prints given text, you can break lines by typing \n |
| cls     | -         | Clears screen |
| setPrompt | string  | Replaces default '>' prompt with given string |
| asynctest |-        | Test command. Example of command using asynchronous calls |

## Requirements
Modern browser supporting ES6.

## todo
- create wiki
- repository service to enable download of custom commands
