Full Documentation
===================

You need to set several attributes (hashes) of imperative-compromise that serve
as configuration before you are able to use it.  

### commands

```javascript
{ 
  "slice": "cut",
  "cut": "cut",
  "slash": "cut",
  "press": "press"
  "push": "push"
}
```
**Key**: The "verb" of the imperative sentence. For example, "slice" is the verb
of "slice the cake".  
**Value**: The "command" the paired key should be
converted into. For the above example, given any of the keys as the verb in a
sentence,  the command will be returned as "cut".  

### objects

```javascript
{
  "pie": "cake",
  "pastry": "cake",
  "cake": "cake",
  "button": "button"
}
```
**Key**: The "object" the verb acts on. For example, "cake" is the object of
"slice the cake".  
**Value**: The type of thing the paired key should be converted into. For the
above example, given any of the keys as the object in a sentence, the type will
be returned as "cake".  

### autoCmds
[optional]
```javascript
{
  "pastry": "cut",
  "button": "press"
}
```
**Key**: The "object" of the sentence.  
**Value**: Expected "command" that the paired key is associated with.  

The parser will try to fill in the correct command if given a sentence without a
verb, but with the object. The object does _not_ have to be included in the
`objects` dictionary, but the command must be one of the categories specified in
the `commands` dictionary.  

### validCmds
[optional]
```javascript
{
  "cut": "cake",
  "push": "button",
  "press": "button"
}
```
**Key**:  A "command".  
**Value**: The "type" that the paired key should be associated with.  

If validCmds is specified, the parser will return `null` if the "type" found in
the sentence does not match the "command".  

### ignore
[optional]  
An array containing string values that you want the parser to ignore.

Input
-----
Once you set the above attributes properly, call `parse(sentence)` where
sentence is a string representing an imperative. For example, `parser.parse
('cut the cake')`  

Output
------
The return value of the `parse()` function is also a JavaScript hash. It has 4
attributes:  
**type**: The "type" of device associated with the object specified in the
input string. For the above examples, this would be "cake" in the sentence
"slice the pie".  
**command**: The "command" that should be done with respect to the "type". For
the above examples, this would be "cut" in the sentence "slice the pie".  
**identifier**: Any extra information specified in the sentence that is not a
verb and does not match anything in `objects`.  
**params**: An array of extra parameters that are passed to the parser, such as
numbers.  
