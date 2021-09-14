---
layout: post
title: Introducing Combinatorics 0.2.0
tags:
 - ruby
 - combinatorics
 - list comprehensions
 - powerset
---

I decided to take my [List Comprehension](/2010/10/01/list-comprehensions-in-ruby.html)
code with some other Combinatorics code I had floating around and release
[Combinatorics](http://rubydoc.info/gems/combinatorics) 0.2.0:

    $ gem install combinatorics

After getting specs on the List Comprehension code, it became easy to
refactor it and get the specs passing on Ruby 1.8.7, 1.9.2 and JRuby.
Unfortunately, [Rubinius](http://rubini.us/) does not yet support
`Enumerator#next`.

The Combinatorics library also contains the
[powerset](http://rubydoc.info/gems/combinatorics/Combinatorics/PowerSet/Mixin#powerset-instance_method)
method, added to `Array` and `Set`:

    require 'combinatorics'

    [1,2,3].powerset
    # => [[],
          [3],
          [2],
          [2, 3],
          [1],
          [1, 3],
          [1, 2],
          [1, 2, 3]]

In Combinatorics 0.2.0,
[Range#&](http://rubydoc.info/gems/combinatorics/Range#%26-instance_method),
[Range#upto](http://rubydoc.info/gems/combinatorics/Range#upto-instance_method)
and [Range#downto](http://rubydoc.info/gems/combinatorics/Range#downto-instance_method)
were also added:

    (1..50) & (20..100)
    # => (20..50)

    (1..5).upto(2..10).to_a
    # => [1..5, 1..6, 1..7, 1..8, 1..9, 1..10,
          2..5, 2..6, 2..7, 2..8, 2..9, 2..10]

    (2..10).downto(1..5).to_a
    # => [2..10, 2..9, 2..8, 2..7, 2..6, 2..5,
          1..10, 1..9, 1..8, 1..7, 1..6, 1..5]

Fork the [Combinatorics](http://github.com/postmodern/combinatorics/#fork_box)
library today, and add your own Combinatoric methods.
