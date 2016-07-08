const utils = {
    htmlEntities: str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const cursor = {
    interval: null,
    character: '_',
    shown: false,
    update: function() {
        this.shown ? this.hide() : this.show();
    },
    show: function() {
        konsole.consoleElement.innerHTML += this.character;
        this.shown = true;
    },
    hide: function() {
        konsole.consoleElement.innerHTML = konsole.consoleElement.innerHTML.slice(0, -1);
        this.shown = false;
    },
    start: function() {
        this.interval = setInterval(this.update.bind(this), 500);
    },
    stop: function() {
        if(this.shown) this.hide();
        clearInterval(this.interval);
    }
}

const konsole = {
    version: "0.1",
    consoleElement: null,
    currentLine: "",
    init: function(element) { 
        this.consoleElement = document.querySelector(element);
        this.consoleElement.setAttribute('style', 'overflow: auto; padding: 10px; box-sizing: border-box;');

        document.onkeypress = this.processKeyCharacter.bind(this);
        document.onkeydown = this.processActionKey.bind(this);
        cursor.start();

        this.createCommand('print', 'Prints given text.', function(args) {
            konsole.writeLine(args.join(' '));
        });

        this.createCommand('help', 'Shows help about given command.', function(args) {
            if (args.length === 0) konsole.writeLine('Usage: help commandName');
            else konsole.writeLine(konsole.commands[args[0]].helpMessage);
        });

        this.createCommand('version', 'Shows konsole.js version.', function() {
            konsole.writeLine('konsole.js version '+konsole.version);
        });
    },
    processKeyCharacter: function(event) {
        if(event.keyCode === 13) return;
        cursor.stop();
        let char = String.fromCharCode(event.keyCode);
        this.currentLine += char;
        this.write(char);
        this.scrollViewToBottom();
        cursor.start();
    },
    processActionKey: function(event) {
        if(this.currentLine.length === 0) return;

        cursor.stop();

        if(event.keyCode === 13) { // enter
            this.breakLine();
            this.parseCommand(this.currentLine);
            this.currentLine = "";
        }
        else if(event.keyCode === 8) { // backspace
            this.currentLine = this.currentLine.slice(0, -1);
            this.consoleElement.innerHTML = this.consoleElement.innerHTML.slice(0, -1);
        }

        this.scrollViewToBottom();

        cursor.start();
    },
    writeLine: function(str) {
        this.write(str);
        this.breakLine();
    },
    breakLine: function() {
        this.consoleElement.innerHTML += '<br>';
    },
    write: function(str) {
        this.consoleElement.innerHTML += utils.htmlEntities(str);
    },
    parseCommand: function(str) {
        let arr = str.split(' ');
        let args = [];
        for (let i=1; i<arr.length; i++) args.push(arr[i]);
        if (this.commands.hasOwnProperty(arr[0])) {
            this.commands[arr[0]].execute(args);
        }
        else {
            this.writeLine('Unknown command: ' + arr[0]);
        }
    },
    createCommand: function(name, helpMessage, callback) {
        this.commands[name] = {
            helpMessage: helpMessage,
            execute: callback
        }
    },
    scrollViewToBottom: function() {
        this.consoleElement.scrollTop = this.consoleElement.scrollHeight - this.consoleElement.clientHeight;
    },
    commands: {}
}

