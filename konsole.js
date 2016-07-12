"use strict";

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
        if (!this.shown) return;
        konsole.consoleElement.innerHTML = konsole.consoleElement.innerHTML.replace(/_$/, '');
        this.shown = false;
    },
    start: function() {
      if(konsole.enableInput)
        this.interval = setInterval(this.update.bind(this), 500);
    },
    stop: function() {
        this.hide();
        clearInterval(this.interval);
    }
}

const konsole = {
    version: '0.1.3',
    consoleElement: null,
    currentLine: '',
    prompt: '>',
    welcomeMessage: '',
    enableInput: true,
    init: function(element, welcomeMessage) {
        this.consoleElement = document.querySelector(element);
        this.consoleElement.setAttribute('style', 'overflow: auto; padding: 10px; box-sizing: border-box;');
        this.welcomeMessage = welcomeMessage || '# konsole.js ' + this.version + ' - Type "help" to see available commands.\\n# Created by Michal Pietraszko (@theHarsay)\\n# Available on Github: github.com/Harsay/konsole.js';

        document.addEventListener('keypress', this.processKeyCharacter.bind(this));
        document.addEventListener('keydown', this.processActionKey.bind(this));

        this.writeLine(this.welcomeMessage);
        this.writePrompt();

        cursor.start();

        this.createCommand('help', 'Shows help about given command.', function(args) {
            if (args.length === 0 || !konsole.commandExists(args[0])) {
                konsole.writeLine('Available commands:');
                for (let command in konsole.commands) {
                    konsole.writeLine(command + ' - ' + konsole.commands[command].helpMessage);
                }
            }
            else {
                konsole.writeLine(konsole.commands[args[0]].helpMessage);
            }
        });

        this.createCommand('version', 'Shows konsole.js version.', function() {
            konsole.writeLine('konsole.js version ' + konsole.version);
        });

        this.createCommand('print', 'Prints given text.', function(args) {
            konsole.writeLine(args.join(' '));
        });

        this.createCommand('cls', 'clears screen', function() {
            konsole.clearScreen();
        });

        this.createCommand('setPrompt', 'sets prompt', function(args) {
            konsole.prompt = args.join(' ');
        });

        this.createCommand('asynctest', 'test asynchornous command', function(args) {
            konsole.toggleInput();
            let interval = setInterval(() => konsole.write('.'), 300);
            setTimeout(() => {
              konsole.writeLine(" Time's up. Let's do this.");
              clearInterval(interval);
              setTimeout(() => {
                konsole.writeLine('LEEEEEEEROOOOOOY JEEEEEENKINNSSSSS!');
                konsole.toggleInput();
              }, 1000);
            }, 1200);
        });
    },
    processKeyCharacter: function(event) {
        let keyCode = event.which || event.keyCode;
        if (!this.enableInput || keyCode === 13 || keyCode === 8) return;

        cursor.stop();

        let char = String.fromCharCode(keyCode);
        this.currentLine += char;
        this.write(char);

        cursor.start();
    },
    processActionKey: function(event) {
        let keyCode = event.which || event.keyCode;

        if (keyCode === 8) event.preventDefault();
        if (!this.enableInput || this.currentLine.length === 0) return;

        cursor.stop();

        if (keyCode === 13) { // enter
            this.breakLine();
            this.parseCommand(this.currentLine);
            this.writePrompt();
            cursor.start();
            this.currentLine = "";
        }
        else if (keyCode === 8) { // backspace
            this.currentLine = this.currentLine.slice(0, -1);
            this.consoleElement.innerHTML = this.consoleElement.innerHTML.slice(0, -1);
        }
    },
    writePrompt: function() {
        if(this.enableInput)
            this.write(this.prompt + ' ');
    },
    writeLine: function(str) {
        this.write(str);
        this.breakLine();
    },
    breakLine: function() {
        this.consoleElement.innerHTML += '<br>';
        this.scrollViewToBottom();
    },
    hasLineBreak: function() {
        return this.consoleElement.innerHTML.substr(this.consoleElement.innerHTML.length - 4) === '<br>';
    },
    removeLineBreak: function() {
        if(this.hasLineBreak())
            this.consoleElement.innerHTML = this.consoleElement.innerHTML.replace(/<br>$/, ''); // replace last occurence of <br> with empty string.
    },
    write: function(str) {
        this.consoleElement.innerHTML += utils.htmlEntities(str).replace(/\\n/g, '<br>');
        this.scrollViewToBottom();
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
    commandExists: function(command) {
        return this.commands.hasOwnProperty(command);
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
    toggleInput: function() {
        this.enableInput = !this.enableInput;
        if(!this.enableInput) {
          cursor.stop();
        } else {
          this.writePrompt();
          cursor.start();
        }
    },
    clearScreen: function() {
        this.consoleElement.innerHTML = "";
    },
    commands: {}
}
