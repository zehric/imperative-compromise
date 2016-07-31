"use strict";
const nlp = require('nlp_compromise');
module.exports = {
  parse: function (sentence) {
    var lexicon = nlp.lexicon();
    var commands = module.exports.commands;
    var objects = module.exports.objects;
    var autoCmds = module.exports.autoCmds;
    var validCmds = module.exports.validCmds;
    var ignore = module.exports.ignore;
    if (!objects || !commands) {
      throw new Error('commands and objects dictionary required');
    }

    var valid = function(type, command, params) {
      var validCmd = validCmds[command];
      return (validCmd === type 
          || Array.isArray(validCmd) && validCmd.indexOf(type) != -1)
        && (command !== 'set' || (command === 'set' && params.length));
    };

    for (var object in objects) {
      lexicon[object] = 'Noun';
    }
    for (var command in commands) {
      lexicon[command] = 'Verb';
    }

    var rootarr = nlp.text(nlp.text(sentence).normal()).terms();
    var arr = rootarr.filter(function(term) {
      return !term.pos.Determiner;
    });
    var intersection = function(arr, dict, remove) {
      for (let i = 0; i < arr.length; i++) {
        var term = arr[i];
        if (dict[term]) {
          if (remove) {
            arr.splice(i, 1);
          }
          return dict[term];
        }
      }
      return false;
    }

    var ignoreTerm = function(text) {
      if (!ignore) {
        return false;
      }
      for (let i = 0; i < ignore.length; i++) {
        if (text === ignore[i]) {
          return true;
        }
      }
    }

    var type = '';
    var command = '';
    var identifier = '';
    var params = [];

    for (let i = 0; i < arr.length; i++) {
      var term = arr[i];
      if (term.pos.Verb || term.pos.Preposition) {
        var splitted = term.text.split(' ');
        var cmd = intersection(splitted, commands);
        if (cmd) {
          command = cmd;
        }
      } else if (!ignoreTerm(term.text)) {
        if (term.number) {
          params.push(term.number);
        } else {
          var splitted = term.text.split(' ');
          var object = intersection(splitted, objects, true);
          if (autoCmds) {  
            var cmd = intersection(splitted, autoCmds);
            if ((!command || command === 'on' || command === 'set') && cmd) {
              command = cmd;
            }
          }
          if (object) {
            type = object;
            identifier += ' ' + splitted.join(' ');
          } else {
            identifier += ' ' + term.text;
          }
        }
      }
    }
    if (validCmds) {
      if (type && !valid(type, command, params)) {
        return null;
      }
      if (!type) {
        type = validCmds[command];
      }
    }
    var returnDict = {
      type: type,
      command: command,
      identifier: identifier.trim(),
      params: params
    };
    return returnDict;
  }
}
