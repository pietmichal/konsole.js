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
        if (this.shown) this.hide();
        clearInterval(this.interval);
    }
}

const konsole = {
    version: "0.1.2dev3",
    consoleElement: null,
    currentLine: "",
    prompt: "> ",
    init: function(element) {
        this.consoleElement = document.querySelector(element);
        this.consoleElement.setAttribute('style', 'overflow: auto; padding: 10px; box-sizing: border-box;');

        document.addEventListener('keypress', this.processKeyCharacter.bind(this));
        document.addEventListener('keydown', this.processActionKey.bind(this));

        this.writeLine('konsole.js ' + this.version + ' - Type "help" to see available commands');
        this.write(this.prompt);

        cursor.start();

        this.createCommand('help', 'Shows help about given command.', function(args) {
            if (args.length === 0 || !konsole.commandExists(args[0])) {
                konsole.writeLine('Available commands:');
                for (let command in konsole.commands) {
                    konsole.writeLine(command);
                }
            }
            else {
                konsole.writeLine(konsole.commands[args[0]].helpMessage);
            }
        });

        this.createCommand('version', 'Shows konsole.js version.', function() {
            konsole.writeLine('konsole.js version '+konsole.version);
        });

        this.createCommand('print', 'Prints given text.', function(args) {
            konsole.writeLine(args.join(' '));
        });
    },
    processKeyCharacter: function(event) {
        let keyCode = event.which || event.keyCode;
        if (keyCode === 13 || keyCode === 8) return;

        cursor.stop();

        let char = String.fromCharCode(keyCode);
        this.currentLine += char;
        this.write(char);
        this.scrollViewToBottom();

        cursor.start();
    },
    processActionKey: function(event) {
        let keyCode = event.which || event.keyCode;

        if (keyCode === 8) event.preventDefault();
        if (this.currentLine.length === 0) return;

        cursor.stop();

        if (keyCode === 13) { // enter
            this.breakLine();
            this.parseCommand(this.currentLine);
            this.write(this.prompt);
            this.currentLine = "";
        }
        else if (keyCode === 8) { // backspace
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
    hasLineBreak: function() {
        return this.consoleElement.innerHTML.substr(this.consoleElement.innerHTML.length - 4) === '<br>';
    },
    removeLineBreak: function() {
        if(this.hasLineBreak())
            this.consoleElement.innerHTML = this.consoleElement.innerHTML.replace(/<br>$/, ''); // replace last occurence of <br> with empty string.
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
    commands: {}
}
