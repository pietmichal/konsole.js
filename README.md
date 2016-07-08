# konsole.js
Command line like application in browser.

Current version: 0.1

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
        #console {
            width: 600px;
            height: 300px;
            background: black;
            color: white;
            font-family: monospace;
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

Working command line:
```
command arguments
```

## Available commands
| command | arguments | description |
| ------- | --------- | ----------- |
| help    | command   | prints information about given command |
| print   | text      | prints given text |
| version | -         | shows konsole.js version |

## Requirements
¯\_(ツ)_/¯
