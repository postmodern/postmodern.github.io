---
layout: post
title: Typos in your Documentation?
tags:
 - documentation
 - typos
 - yard
 - spellcheck
---

**More likely than you think.** 

Having good documentation (internal and external) can make or break bigger
projects. Good documentation helps skilled users/developers get up to
speed with your project. However, bad documentation will drive potential
users away. Typos are probably the most embarrassing thing to find in
documentation.

One day I was fixing a trivial bug in my code for a new-user, and glanced
over the documentation. Low and behold I spot a typo right above the broken 
method. In this moment of embarrassment (in front of the new-user),
I said enough is enough, **no more typos!**

Since I use [YARD](http://yardoc.org/) for all of my projects, I decided
to write a YARD plugin which would scan all of my documentation text using
the [Hunspell](http://hunspell.sourceforge.net/) spellchecking library
(via [ffi-hunspell](http://github.com/postmodern/ffi-hunspell#readme)).
A couple days later,
[yard-spellcheck](https://github.com/postmodern/yard-spellcheck#readme)
was printing typos with file-names, line-numbers and ANSI highlighting.

As I suspected, I was able to find and fix a handful of typos in my own
libraries, thanks to `yard-spellcheck`. Next, I started scanning larger
projects with YARD documentation. I found a couple typos in
[DataMapper](http://datamapper.org/) and even
[YARD](http://github.com/lsegal/yard#readme) itself (all are fixed now).

The lesson of this short story is that typos are lurking everywhere; too
numerous and well hidden for human eyes to catch them all. Luckily, we
now have an automated-tool in the fight against typos. The Ruby Community
is notably obsessed with testing and quality of software, we should feel
the same way about our documentation.

    $ gem install yard-spellcheck
    $ cd my_project/
    $ yard-spellcheck

