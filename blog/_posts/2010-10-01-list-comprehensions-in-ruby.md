---
layout: post
title: List Comprehensions in Ruby
tags:
 - ruby
 - list
 - comprehension
---

Recently I have been interested in [Haskell](http://haskell.org/) and been
skimming the whimsical (yet informative)
[Learn a Haskell, for Great Good!](http://learnyouahaskell.com/).
One feature I really like from Haskell is their implementation of
list comprehensions:

    Prelude> [(x,y) | x <- [1..10], y <- [2..8]]
    [(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),
    (2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),
    (3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),
    (4,2),(4,3),(4,4),(4,5),(4,6),(4,7),(4,8),
    (5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,8),
    (6,2),(6,3),(6,4),(6,5),(6,6),(6,7),(6,8),
    (7,2),(7,3),(7,4),(7,5),(7,6),(7,7),(7,8),
    (8,2),(8,3),(8,4),(8,5),(8,6),(8,7),(8,8),
    (9,2),(9,3),(9,4),(9,5),(9,6),(9,7),(9,8),
    (10,2),(10,3),(10,4),(10,5),(10,6),(10,7),(10,8)]

This list comprehension is essentially a Set definition using first-order
predicate logic, with universal quantifiers on `x` and `y` (where the Set
contains the tuples composed of every `x` and every `y` from the ranges
`1..10` and `2..8`). Amazingly, the Haskell version looks almost exactly
like the Set definitions from my
[Discrete Structures, Logic, and Computability (2nd edition)](http://www.amazon.com/Discrete-Structures-Computability-Bartlett-Computer/dp/0763718432)
book, except without the curly-braces or universal quantifiers
(![universal quantifier](http://upload.wikimedia.org/math/d/4/d/d4d49bead125261b226eaa867bd016ce.png)).

One does not have to learn functional programming and Haskell to use list
comprehensions, Python has them as well:

    >>> [(x,y) for x in range(0,11) for y in range(2,9)]
    [(0, 2), (0, 3), (0, 4), (0, 5), (0, 6), (0, 7), (0, 8),
    (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
    (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8),
    (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8),
    (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8),
    (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8),
    (6, 2), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8),
    (7, 2), (7, 3), (7, 4), (7, 5), (7, 6), (7, 7), (7, 8),
    (8, 2), (8, 3), (8, 4), (8, 5), (8, 6), (8, 7), (8, 8),
    (9, 2), (9, 3), (9, 4), (9, 5), (9, 6), (9, 7), (9, 8),
    (10, 2), (10, 3), (10, 4), (10, 5), (10, 6), (10, 7), (10, 8)]

Granted, using the `for` loop syntax as constraints for the list
comprehension is not as sexy as the Haskell version, but it gets the job
done.

Unfortunately, Ruby does not support list comprehensions, and only has
a couple methods for doing [Combinatorics](http://en.wikipedia.org/wiki/Combinatorics) (`Array#combination` and `Array#permutation`).
So, I [implemented list comprehensions](http://gist.github.com/605891)
for the Ruby `Array` class:

    >> require './array_comprehension'
    => true
    >> [(1..10), (2..8)].comprehension.to_a
    => [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
        [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
        [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8],
        [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8],
        [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8],
        [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8],
        [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8],
        [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8],
        [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8],
        [10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [10, 8]] 


I used `yield` to quickly pass results to the given block, to not
stress the Garbage Collector with building a huge Arrays. The method also
returns an [Enumerator](http://rubydoc.info/docs/ruby-core/1.9.2/Enumerator)
object if no block is given, to fake Haskells lazy evaluation.

Note, that the `Array` may contain:

* [Enumerable](http://rubydoc.info/docs/ruby-core/1.9.2/Enumerable) objects:

        >> [('a'..'f'),(0..10).step(2)].comprehension.to_a
        => [["A", 0], ["A", 2], ["A", 4], ["A", 6], ["A", 8], ["A", 10],
            ["B", 0], ["B", 2], ["B", 4], ["B", 6], ["B", 8], ["B", 10],
            ["C", 0], ["C", 2], ["C", 4], ["C", 6], ["C", 8], ["C", 10],
            ["D", 0], ["D", 2], ["D", 4], ["D", 6], ["D", 8], ["D", 10],
            ["E", 0], ["E", 2], ["E", 4], ["E", 6], ["E", 8], ["E", 10],
            ["F", 0], ["F", 2], ["F", 4], ["F", 6], ["F", 8], ["F", 10]] 

* Non-enumerable objects:

        >> [5,(6..9),10].comprehension.to_a
        => [[5, 6, 10], [5, 7, 10], [5, 8, 10], [5, 9, 10]]

* Even other list comprehensions:

        >> syllable = (['a'..'z'] * 2).comprehension
        >> word = [syllable] * 4
        >> number = (1..100)
        >> [*word, number].comprehension { |*s| puts s.join }

This code does require Ruby 1.9 since [Enumerator#peek](http://rubydoc.info/docs/ruby-core/1.9.2/Enumerator#peek-instance_method)
was not back-ported to Ruby 1.8.7.

    $ rvm install 1.9.2

