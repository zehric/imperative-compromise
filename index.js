const nlp = require('nlp_compromise');
// var validCmds = {
//   'on': 'light',
//   'off': 'light',
//   'set': 'light',
//   'unlock': 'lock',
//   'lock': 'lock',
//   'heat': 'thermostat',
//   'cool': 'thermostat',
//   'arm': 'security',
//   'disarm': 'security'
// }

var similarArrays = function (dm1, dm2) {
  return dm1[0] === dm2[0] || dm1[0] === dm2[1]
    || dm1[1] === dm2[0] || dm1[1] === dm2[1];
};
var valid = function(type, command, params) {
  validCmd = validCmds[command];
  return (validCmd === type 
    || Array.isArray(validCmd) && validCmd.indexOf(type) != -1)
    && (command !== 'set' || (command === 'set' && params.length));
};

module.exports = {
  commands: {},
  objects: {},
  parse: function (sentence) {
    var lexicon = nlp.lexicon();
    var commands = module.exports.commands;
    var objects = module.exports.objects;
    var cmdObjects = module.exports.cmdObjects;
    var validCmds = module.exports.validCmds;

    // var commands = {
    //   'enable': 'on',
    //   'on': 'on',
    //   'disable': 'off',
    //   'off': 'off',
    //   'open': 'unlock',
    //   'unlock': 'unlock',
    //   'close': 'lock',
    //   'lock': 'lock',
    //   'heat': 'heat',
    //   'warm': 'heat',
    //   'cool': 'cool',
    //   'set': 'set',
    //   'arm': 'arm',
    //   'disarm': 'disarm'
    // };
    // var objects = {
    //   'lamp': 'light',
    //   'light': 'light',
    //   'lightbulb': 'light',
    //   'thermostat': 'thermostat',
    //   'heater': 'thermostat',
    //   'cooler': 'thermostat',
    //   'c': 'thermostat',
    //   'c.': 'thermostat',
    //   'air conditioner': 'thermostat',
    //   'security': 'security',
    //   'door': 'lock',
    //   'lock': 'lock',
    //   'entrance': 'lock',
    //   'exit': 'lock'
    // };
    // var cmdObjects = {
    //   'heater': 'heat',
    //   'cooler': 'cool',
    //   'c': 'cool',
    //   'c.': 'cool',
    //   'air conditioner': 'cool'
    // };

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
      } else if (term.text !== 'percent' && term.text !== 'degrees') {
        if (term.number) {
          var n = term.number;
          if (arr[+i + 1] && arr[+i + 1].text === 'percent') {
            params.push(n / 100);
            if (!type) type = 'light';
            if (!command) command = 'set'
          } else if (arr[+i + 1] && arr[+i + 1].text === 'degrees'){
            params.push(n);
            if (!type) type = 'thermostat';
            if (!command) command = 'set';
          } else {
            params.push(n);
          }
        } else {
          var splitted = term.text.split(' ');
          var object = intersection(splitted, objects, true);
          if (cmdObjects) {  
            var cmd = intersection(splitted, cmdObjects);
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
  },
  similar: function(objects, speech, parsed) {
    var dm = require('double-metaphone');
    var objectArr = [];
    for (let i = 0; i < objects.length; i++) {
      for (let j = 0; j < speech.length; j++) {
        if (similarArrays(dm(objects[i]), dm(speech[j]))) {
          objectArr.push(objects[i]);
        }
      }
    }
    return objectArr;
  }
}
