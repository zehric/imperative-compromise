Imperative Compromise
====================

imperative-compromise is a simple application that takes in natural language and
outputs machine-readable JSON, created for the purpose of controlling smart home
devices with voice. It is currently being used by [Rently
Keyless](http://www.rentlykeyless.com/) for voice control. However, this purpose
can be generalized and extended to anything requiring parsing of "imperative"
speech, such as a personal assistant or robot.  It uses
[nlp_compromise](http://nlp-compromise.github.io/website/) for fast imperative
natural language processing.

Installation
-----------
This module is installed with npm.

> `npm install imperative-compromise --save`

Usage Example
-----------
```javascript
const parser = require('imperative-compromise');
parser.commands = {
  'enable': 'on',
  'on': 'on',
  'disable': 'off',
  'off': 'off',
  'open': 'unlock',
  'unlock': 'unlock',
  'close': 'lock',
  'lock': 'lock',
  'heat': 'heat',
  'warm': 'heat',
  'cool': 'cool',
  'set': 'set',
  'arm': 'arm',
  'disarm': 'disarm'
};
parser.objects = {
  'lamp': 'light',
  'light': 'light',
  'lightbulb': 'light',
  'thermostat': 'thermostat',
  'heater': 'thermostat',
  'cooler': 'thermostat',
  'security': 'security',
  'door': 'lock',
  'lock': 'lock',
  'entrance': 'lock',
  'exit': 'lock'
};
parser.autoCmds = {
  'heater': 'heat',
  'cooler': 'cool'
};
parser.validCmds = {
  'off': 'thermostat',
  'set': 'thermostat',
  'unlock': 'lock',
  'lock': 'lock',
  'heat': 'thermostat',
  'cool': 'thermostat',
  'arm': 'security',
  'disarm': 'security'
};
parser.ignore = ['degrees', 'percent'];

parser.parse('unlock the front door');
//{ type: 'lock', command: 'unlock', identifier: 'front', params: [] }
parser.parse('lock');
//{ type: 'lock', command: 'lock', identifier: '', params: [] }
parser.parse('heat the living room to seventy six degrees');
//{ type: 'thermostat', command: 'heat', identifier: 'living room', params: [ 76 ] }
```
### [Full documentation](https://github.com/zehric/imperative-compromise/blob/master/docs.md)

[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
