---
layout: post
title: Enumerating XKCD-style passwords with Ruby
tags:
 - ruby
 - chars
 - wordlist
 - password
 - enumeration
 - hacking
 - security
---

In [XKCD comic #936](https://xkcd.com/936/) it explains how to measure password
strength and how to come up with a more "secure" password. In this blog post I
will show you how to enumerate such XKCD-style passwords using [Ruby][ruby].

To do this we will use two libraries: [wordlist] and [chars].

```shell
$ gem install wordlist chars
```

The [wordlist] library allows one to open/build wordlists, enumerate them,
combine multiple wordlists together, and even mutate each word in the wordlist.
The [chars] library allows working with common character sets, such as digits,
alpha-numeric, punctuation, etc.

## Tr0ub4dor

The first XKCD password ("Tr0ub4dor&3") seems pretty difficult to guess, but
it's actually quite easy to enumerate. The original word is "troubador", with
some character/case substitutions, and one punctuation character along with one
number appended to the end. Chaining together
[wordlist's string manipulation methods][wordlist string manipulation]
we can enumerate over every possible mutation of "troubador".

```ruby
require 'wordlist'
require 'chars'

base_words = Wordlist::Words["troubador"]
passwords  = base_words * Chars.punctuation.chars * Chars.digits.chars
mutations  = passwords.mutate(/oa/, 'o' => '0', 'a' => '4').mutate_case

mutations.each { |password| puts password }
```

The above code creates a list of literal words, then combines them with all
symbol characters and all digit characters, and finally it applies mutation
rules to mutate the case of letters and substitutes `o` for `0` and `a` for `4`.

Now let's enumerate through all possible passwords. Let 'er rip!

```
troubador 0
Troubador 0
tRoubador 0
trOubador 0
troUbador 0
trouBador 0
troubAdor 0
troubaDor 0
troubadOr 0
troubadoR 0
TRoubador 0
TrOubador 0
TroUbador 0
TrouBador 0
TroubAdor 0
TroubaDor 0
TroubadOr 0
TroubadoR 0
tROubador 0
tRoUbador 0
...
TrOuBADOR!9
TroUBADOR!9
tROUBADOr!9
tROUBADoR!9
tROUBAdOR!9
tROUBaDOR!9
tROUbADOR!9
tROuBADOR!9
tRoUBADOR!9
trOUBADOR!9
TROUBADOr!9
TROUBADoR!9
TROUBAdOR!9
TROUBaDOR!9
TROUbADOR!9
TROuBADOR!9
TRoUBADOR!9
TrOUBADOR!9
tROUBADOR!9
TROUBADOR!9
```

## correcthorsebatterystapler

The second XKCD password ("correcthorsebatterystapler") is four random words
concatenated together. Assuming we have a wordlist of common English words,
all we have to do is combine that wordlist with itself four times, then call
`.each` like in the previous example.

```ruby
require 'wordlist'

common_words = Wordlist.open('common_words.txt')
passwords    = common_words ** 4

passwords.each { |password| puts password }
```

The above code opens a `.txt` wordlist file, then creates a new wordlist object
(`passwords`) that is simply the wordlist multiplied by itself four times;
in Ruby `**` is the power operator.

Let's see if it works. Let 'er rip!

```
aahedaahedaahedaahed
aahedaahedaahedaahing
aahedaahedaahedaalii
aahedaahedaahedaaliis
aahedaahedaahedaardvark
aahedaahedaahedaardvarks
aahedaahedaahedaardwolf
aahedaahedaahedaardwolves
aahedaahedaahedaargh
aahedaahedaahedaaron
aahedaahedaahedaaronic
aahedaahedaahedaaronical
aahedaahedaahedaaronite
aahedaahedaahedaaronitic
aahedaahedaahedaarrgh
aahedaahedaahedaarrghh
aahedaahedaahedaasvogel
aahedaahedaahedaasvogels
aahedaahedaahedababdeh
aahedaahedaahedababua
...
```

While it definitely took much longer to enumerate over every four common English
words, it is still possible to easily enumerate over every possible password.

## Bonus Challenge

What if we used different words for the first and second word, added random
punctuation in between the words, and appended multiple digits?

```ruby
require 'wordlist'
require 'chars'

wordlist1 = Wordlist.open('animals.txt')
wordlist2 = Wordlist.open('months.txt')
passwords = wordlist1 * Chars.punctuation.chars * wordlist2 * Chars.digits.strings_of_length(1..4)

passwords.each { |password| puts password }
```

The above code opens two wordlists for the first and second words, combines the
first wordlist with all punctuation characters, combines the second wordlist,
then combines all possible strings of lengths 1-4 of digit characters.

```
dog january0
dog january1
dog january2
dog january3
dog january4
dog january5
dog january6
dog january7
dog january8
dog january9
dog january00
dog january01
dog january02
dog january03
dog january04
dog january05
dog january06
dog january07
dog january08
dog january09
...
pony!december9980
pony!december9981
pony!december9982
pony!december9983
pony!december9984
pony!december9985
pony!december9986
pony!december9987
pony!december9988
pony!december9989
pony!december9990
pony!december9991
pony!december9992
pony!december9993
pony!december9994
pony!december9995
pony!december9996
pony!december9997
pony!december9998
pony!december9999
```

## Conclusion

As you can see, we can easily enumerate complex password patterns using the
[wordlist] and [chars] libraries, and it didn't take that much code! This can
be incredibly powerful when combined with a login bruteforcing or password
cracker. By combining wordlists and character sets, instead of bruteforce
enumerating over every ASCII character one-by-one, we can also reduce the size
of the search space and thus reduce the time it takes to bruteforce/crack a
password.

**tl;dr** Don't get your security advice from a web comic. Use a password
manager that generates truly random passwords and turn on 2FA.

[ruby]: https://www.ruby-lang.org/
[wordlist]: https://github.com/postmodern/wordlist.rb#readme
[wordlist string manipulation]: https://github.com/postmodern/wordlist.rb#string-manipulation
[chars]: https://github.com/postmodern/chars.rb#readme
