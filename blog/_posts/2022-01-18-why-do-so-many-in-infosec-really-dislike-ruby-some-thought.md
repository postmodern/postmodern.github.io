---
layout: post
title: Why do so many in InfoSec really dislike Ruby? Some Thoughts
tags:
 - ruby
 - infosec
---

It is no secret that there are many people in the InfoSec community who are
very vocal about the fact that they really do not like the [Ruby][ruby]
programming language. You can often see this sentiment on Twitter, Reddit, or
simply by searching for "ruby" on popular InfoSec Discord servers.
Oddly, these individuals can never really articulate just what it is
about Ruby that they dislike so much or are misinformed.

In this blog post I will investigate the common reasons for this vocal and
generalized disdain for Ruby within the InfoSec community. I also hope to debunk
some of these commonly held reasons.

## Disclaimer

For The Record, the purpose of this blog post is not to shame anyone, nor
is to silence any legitimate criticism of Ruby. If you have legitimate and well
researched criticism of Ruby, that is not based solely on opinion or personal
preference, then by all means share it as that is generally how we improve
things. Nor is the purpose of this blog post to force you to like Ruby.
If you do not like Ruby, then simply do not use it.

## Background

Background: I have been a Rubyist for more than ten years now, have written
many Ruby libraries and tools, even written a few sort-of-popular Ruby Security
related tools (ex: [spidr], [ruby-nmap], and [bundler-audit]). I have also seen
and received my fair share of "Ruby hate" from hackers and InfoSec professionals
over the years. I used the term "Ruby hate" because in the past other's disdain
for Ruby has crossed the line into repeated trolling and harassment.

[spidr]: https://github.com/postmodern/spidr#readme
[ruby-nmap]: https://github.com/sophsec/ruby-nmap#readme
[bundler-audit]: https://github.com/rubysec/bundler-audit#readme

## Reason #1: Everyone Else Is Doing It

Probably the most simple explanation of why there's so much general disdain
directed at Ruby in InfoSec spaces, is that everyone else is doing it.
You can see a similar behavior in the programming world, in how programmers
love to complain about Perl, Java, or XML, despite the fact that most
programmers under 40 have never actually worked with Perl, Java, or XML.
They are merely complaining about these things because they see others complain
about them, and want to fit in with programmer culture.

New members in a group, or members who question whether they "belong", will be
more likely to mimic the behaviors they see from established or long-time
members. Thus, if others in InfoSec communities are constantly bemoaning Ruby
(despite not having much experience or understanding of it) then new members
will be more likely to mimic that behavior to show that they are "one of the
team".

## Reason #2: It was Over-Hyped, Once

Back in the late 2000s - early 2010s, Ruby On Rails was _the_ "new hotness".
Slashdot, Digg, Reddit, HN, Twitter, were full of blog posts about Rails. All
of the hip new startups and consultancies were building their apps with Rails.
Ruby On Rails helped put Ruby on the map, when it previously was seen as an
experimental scripting language.

When anything becomes over-hyped there is inevitably a backlash due to
over saturation. People became annoyed with constantly reading about Ruby and
Rails, or developed a grudge against Ruby or Rails for stealing the spotlight
away from their favorite programming language or web framework.

However, technology marched on. Scala and then Clojure briefly
became the hot new programming language. Node.js came on to the scene
and promised to allow JavaScript developers to write backend code; for better
or worse. Then Google released Go, which allowed you to write safe(r) system
utils that compiled down to native code. As a result Ruby and Ruby On Rails
has cooled down.

Ruby is no longer the "it" language, just yet another language one can
use if they want to. People still like and use Ruby, but not because of it's
hype, but because it has features that some people still enjoy. Yet there seems
to be some grey beards in InfoSec who still think Ruby is over-hyped, despite
all of the other programming languages that have stolen the spotlight since
then, and are still bitter about it for some reason.

## Reason #3: Misinformation

Sadly, there is a lot of misinformation floating around about programming
language features and performance. Some of it is simply outdated information
that keeps being repeated because no one bothers to verify if it's still true or
correct the person repeating it. Other times it's people just making
assumptions. Yet other times it's from those websites that compare programming
languages or other software, but who's comparisons read like they were generated
by some Machine Learning text generator bot and are full of inaccuracies.

Once the misinformation is out there, people will continue believing and
repeating it, making it very difficult to correct.

Some popular misinformation about Ruby:

* "Ruby is dead \*links to TIOBE Index\*" The TIOBE Index just tracks Google
  Search results for programming language names, and doesn't factor in other
  popular frameworks/libraries, [cache.ruby-lang.org] downloads, [rubygems.org]
  downloads, or daily visitors to [ruby-doc.org] or [rubydoc.info]. TIOBE is a
  imprecise metric at best. Also, programming languages rarely ever die,
  with the rare exceptions of Flash's ActionScript and Microsoft's SilverLight.
  If COBOL and Fortran are still around, I don't think Ruby is going to
  disappear over night.
* "Ruby's Encoding/Regex/Threading is garbage" - Ruby's character Encoding
  engine uses [libiconv], like everything else. Ruby's Regex engine uses
  [libpcre], like everything else. Ruby's Threading uses Native POSIX Threading
  Library (NPTL), just like everything else.
* "Ruby/Rails can't scale". Scaling has more to do with the architecture of
  your application or infrastructure. Database normalization, replication, load
  balancing, background job processing, distributed workers and messaging
  queues, are far more important than what language you pick.
* "Ruby is like Perl". Ruby has very little in common with Perl. There many be
  some similarly named methods, but that's about it. Ruby's Object Model is
  inspired directly from [Smalltalk] and it's support for closures is heavily
  inspired by LISP.
* "Ruby is slow". Ruby has roughly the same performance characteristics as any
  other dynamic interpreted scripting language. If you want native performance,
  then use a modern language which compiles down to native code, such as C++11,
  [Go], [Rust], [Zig], [Nim], or [Crystal].

[TIOBE Index]: https://www.tiobe.com/tiobe-index/
[cache.ruby-lang.org]: https://cache.ruby-lang.org/pub/ruby/
[rubygems.org]: https://rubygems.org/
[ruby-doc.org]: https://ruby-doc.org/
[rubydoc.info]: https://rubydoc.info/stdlib

[libiconv]: https://www.gnu.org/software/libiconv/
[libpcre]: https://www.pcre.org/

[Smalltalk]: http://patshaughnessy.net/2012/12/17/ruby-smalltalk-and-class-variables

[Go]: https://golang.org/
[Rust]: https://www.rust-lang.org/
[Zig]: https://ziglang.org/
[Nim]: https://nim-lang.org/
[Crystal]: https://crystal-lang.org/

## Reason #4: Lack of Hands On Experience

When you haven't had hands on experience with a tool or technology, you tend
to view that tool or technology as strange, foreign, untested, experimental,
risky, or a liability. Worse is when people will implicitly accept and repeat
other people's opinions about that tool or technology without doing their own
testing.

If you asked someone who strongly dislikes Ruby whether they actually tried
learning Ruby, have they visited [ruby-lang.org][ruby], have they visited
[try.ruby-lang.org], have they read any guides or tutorials, watched any
screencasts, tried writing any Ruby, popped open `irb` (Ruby's interactive
console), or do they know that Ruby supports most all of the same features
that Python supports and then a few extra ones, the answer will usually be "No".

[try.ruby-lang.org]: https://try.ruby-lang.org/

Simply put, most people who dislike Ruby don't actually know why they dislike
it. They most likely looked at some example code and thought it looked weird
or heard other people complaining about Ruby.

## Reason #5: Bad Experiences

A common bad experience I see people having is when someone wants to install or
setup a complex Ruby/Rails app, but lacks the sysadmin/DevOps knowledge, or
didn't take the time to read the instructions, or Google for the answer, and
get frustrated. They are unfamiliar with how to install `ruby`
(fyi: `sudo apt install -y ruby-full` on Ubuntu), or how to install gems
globally (ex: `sudo gem install <gem>`), or how to install gem dependencies
locally using [bundler] \(fyi: `bundler install --path vendor/bundle`\), or
that some rubygems need to compile C extensions against system libraries/headers
(ex: [sqlite3] gem requires `libsqlite3-dev`/`libsqlite3-devel` to be
installed). When your learning a new set of tools and getting frustrated, it's
easy to blame the tools, instead of taking a step back, cooling down, and
trying to Google or ask for help.

[bundler]: https://bundler.io/
[sqlite3]: https://rubygems.org/gems/sqlite3

Another common bad experience I frequently see people on InfoSec Discord servers
struggling with, is how to get some random Ruby script working. Usually the Ruby
script in question is a 3rd-party MSF module they found on [exploit-db] or
[packetstorm]. In most cases, the person is struggling with how to install
the script's dependencies, installing Metasploit, trying to run the MSF module
as a standalone script (which Metasploit does not support), or have hit a bug in
the Ruby script / MSF module.

[exploit-db]: https://www.exploit-db.com/
[packetstorm]: https://packetstormsecurity.com/

A less common bad experience that shapes people's perception of Ruby is having
to setup a legacy Ruby/Rails app that hasn't been maintained for a while and has
it's own issues. These legacy apps will have outdated dependencies that need
updating, might require a specific older version of Ruby (a bad practice, imo),
it might not have a `bootstrap` or `setup` script, and it probably won't have a
`Dockerfile`. Let's me be blunt, legacy apps regardless of which programming
language they are written in are always a PITA to install and setup. My advice
is to ask for expert help or use another app that's better maintained.

If people witness enough bad experiences and read enough horror stories, they
will try to pinpoint the lowest common denominator that all of the bad
experiences and horror stories have in common: the programming language.
They will then associate the programming language with errors and frustration.

The unfortunate truth is you can write buggy code or have unmaintained legacy
apps in _any_ language. It is the developer's and maintainer's
responsibility to keep bugs out and keep projects up-to-date.
No programming language will do that for you.

## Reason #6: First Time Programmers

Any programmer who has learned their first language will insist, that their
first programming language is the coolest and most awesome-est programming
language ever created. A programmer who has learned more than one language
will admit that both programming languages are kind of similar, just with
different syntax and different ways of doing things.

Most programming languages can be classified as Dynamic or Static Typed,
Interpreted or Compiled, Imperative vs Functional, or Object Orientated vs
Functional. When one branches out from their first programming language, they
will notice that most Object Orientated languages have some concept of Classes
and Inheritance. Most Imperative languages have some kind of `if`, `else if`,
`else`, `case`, `for`, and `while` statements. Most compiled languages have a
build system, in addition to the compiler. Most Interpreted languages have
a REPL (aka console), debugger, and possibly a package/dependency manager.

For most new people getting into InfoSec, Python is either the only
general purpose scripting language they know or their first programming
language all together. Anytime someone new to InfoSec asks which programming
language they should learn, Python is usually the first recommendation.
Predictably many in InfoSec think Python is the greatest thing since sliced
bread, because they haven't really explored the wider ecosystem of programming
languages. Some people take this even further and interpret any discussion of
any programming language besides Python as a threat to their favorite
programming language.

I only know of an elite dozen or so Rubyists in the InfoSec community
(obligatory "There are dozens of us. Dozens!") and rarely see anyone
recommending to learn Ruby; and if they do there's always a few people who will
chime in to remind everyone how much they dislike Ruby which likely discourages
people from trying to learn Ruby.

With Ruby being in the minority and Python in the majority, you inevitably get
this Ford vs. Chevy tribalism, but about Python vs. Ruby.

## Reason #7: Ford vs. Chevy Tribalism

In the tech world there is no shortage of endless tribal debates over which
thing is better than the other thing. Tabs vs. Spaces, Vim vs. Emacs, Linux vs. Windows, Linux vs. macOS, BSD vs. Linux, GNU vs. BSD, Chrome vs Firefox, Intel vs. AMD, NVIDIA vs. AMD, QWERTY vs. Dvorak, and yes even Ruby vs. Python.

The Ruby vs. Python debate is incredibly pointless, once you realize that both
languages share a lot in common:

* Both are General Purpose Programming Languages.
* Both are Interpreted scripting languages.
* Both Dynamically Typed languages; Python Type Hints are not the same as
  Static Typing.
* Both are Object Orientated Programming languages.
* Both support the basic primitive types (Class, Null type, Boolean types,
  Integers, Strings, Arrays, Hash-tables, Sets)
* Both support function "Currying".
* Both support Closures.
* Both support "Generators".
* Both support "Opening Classes".
* Both support defining a catch-all method.
* Both support "meta-programming".
* Both support `eval()`.
* Both have a Global Interpreter Lock (GIL), which prevents any two threads
  from running simultaneously on different CPU cores.
* Both support threads; despite the GIL only allowing one thread to run at a
  time.
* Both support some type of "Green Threads".
* Both have a Garbage Collector (GC).
* Both have a byte-code VM.
* Both support Asynchronous IO.
* Both support C Bindings using [libffi].
* Both have an interactive console.
* Both have a package manager and package repository.
* Both have CLI and GUI toolkit libraries.
* Both have Database ORMs.
* Both have Web application frameworks.
* Both have "virtual environment" managers for creating isolated dev
  environments.
* Both were created in the early 1990s.

[libffi]: https://sourceware.org/libffi/

Where the two languages differ:

* Python philosophy is "There Is One Way To Do Things" or "Explicit over
  Implicit", where as Ruby's philosophy is "Programmer Happiness"
  (read: it lets you take shortcuts and stays out of your way).
  Although, there are examples in both languages where they fail to abide by
  these philosophies.
* Python is whitespace sensitive, where as Ruby doesn't care. Instead of the
  Ruby language enforcing style guidelines, the Ruby community has a bunch of
  suggested style rules, such as two space indentation, which you can choose to
  ignore if you need to vertically align some code.
* Python requires parenthesis in function/method definitions, even if they
  accept no arguments. Ruby allows omitting the parenthesis if the method does
  not accept any arguments.
* Python Strings are immutable, where as Ruby [Strings][String] are mutable;
  unless you explicitly `freeze` them. Ruby also supports [Symbols][Symbol],
  which are like Strings, but immutable and mostly used as identifiers.
* Python has a separate type for binary Strings called `bitstring`, where as
  Ruby just has [String] which can contain UTF-8, ASCII, or any other weird
  character encoding (ex: `UTF-7`).
* Python supports Regular Expressions via the `re` library which parses a
  regular expressions as strings. Where as in Ruby regular expressions  have
  special inline syntax (ex: `/[0-9a-fA-F]+/`) which returns a [Regexp] object.
* Python's `join` function is backwards (ex: `" ".join(list)`), where as in Ruby `join` is a method of [Array]. (ex: `[1,2,3].join(' ')`)
* Python calls their Array type `list`, where as Ruby calls them [Array].
* Python calls their Hash Table type `dict`, where as Ruby calls them [Hash].
* Python supports Tuples, Ruby only has [Array]s, [Hash]es, and [Set]s.
* Python Dictionaries raise an error if the requested key is missing, where as
  Ruby Hashes returns `nil`; but you can use the [fetch][Hash#fetch] method
  which can raise `KeyError` unless you also give it a default value to
  fallback to.
* Python supports List Comprehensions, Ruby does not. However, Ruby does support
  [lazy chainable Enumerators][Enumerator::Lazy].
* Python lambda's are parenthesis-style callable (ex: `mylambda(1,2,3)`), where
  as in Ruby lambdas are really [Proc] objects and have to be called via the
  `call` method (ex: `mylambda.call(1,2,3)`). See [Ruby is NOT a Callable
  Oriented Language (It's Object Oriented)](https://yehudakatz.com/2010/02/21/ruby-is-not-a-callable-oriented-language/)
  explaining the trade-offs of having an explicit `.call()` method.
* Ruby supports closures with explicit syntax (`yield 1,2,3` and
  `foo { |a,b,c| ... }`).
* Python has special semantics for Generator functions, while in Ruby any method
  can be passed a closure block and `yield` data to that closure block,
  or explicitly return an [Enumerator] if no closure block was passed to the
  function.
* Python supports top-level functions (ex: `len()`), where every function is a
  method belonging to an Object. Even "top-level" methods in Ruby are simply
  methods defined in the [Kernel] module.
* Python has the top-level `range()` function, where as in Ruby you just type
  in `1..10` and gives you a literal [Range] value.
* Python has special syntax for selecting a range of elements from a list, where
  as in Ruby you can either call [Array#[]] with index and length arguments
  (ex: `array[3,2]`) or a literal [Range] value (ex: `array[3..5]`).
* Python supports decorator functions by defining inner functions and passing in
  a function object. Ruby supports passing in closure blocks to methods that
  yielding control or data which allows the method to wrap around other code.
  You can also pass in methods as closures (ex: `array.map(&method(:some_method))`).
  Or you can use [Module#prepend] to inject a modules above the class allowing
  the module to intercept method calls before they reach the class or it's
  superclass.
* Python supports namespaces, where as Ruby uses explicitly nested modules;
  oddly this is an example where Ruby is _more_ explicit than Python.
* Python supports multiple-inheritance, where as Ruby only supports inheriting
  from one superclass, but you can include as many other Modules as you like.

[Module]: https://rubydoc.info/stdlib/core/Module
[Module#prepend]: https://rubydoc.info/stdlib/core/Module#prepend-instance_method
[String]: https://rubydoc.info/stdlib/core/String
[Regexp]: https://rubydoc.info/stdlib/core/Regexp
[Range]: https://rubydoc.info/stdlib/core/Range
[Array]: https://rubydoc.info/stdlib/core/Array
[Hash]: https://rubydoc.info/stdlib/core/Hash
[Hash#fetch]: https://rubydoc.info/stdlib/core/Hash#fetch-instance_method
[Enumerator]: https://rubydoc.info/stdlib/core/Enumerator
[Enumerator::Lazy]: https://rubydoc.info/stdlib/core/Enumerator/Lazy
[Set]: https://rubydoc.info/stdlib/set/Set
[Kernel]: https://rubydoc.info/stdlib/core/Kernel
[Proc]: https://rubydoc.info/stdlib/core/Proc
[Method]:https://rubydoc.info/stdlib/core/Method

As you can see, both languages have very similar architectures, but slight
differences in the language semantics. Arguing over which 30yr old language
has slightly better semantics is a waste of time. Both languages could probably
benefit from changing or removing some of their legacy features that have
accumulated over the decades. Ultimately it's up to your personal preference
whether you want a strict programming language or a programming language that
gives you lots of tools and shortcuts to get things done.

## Reason #8: Obsession with Uniformity

There is this persistent misconception within Tech that if we all used the
same OS, the same text editor, the same programming language, and worked on the
same projects, then we would be super productive! This is so incorrect for two
reasons:

1. No one can agree on the one true OS, text editor, programming language, etc.
2. Trying to coerce everyone to conform to one standard set of tools creates
   friction, limits creativity, reduces productivity, and leads to monoculture
   and stagnation.

Everyone has different preferences on tools or programming languages, and they
tend to also form communities around those preferences (ex: the Linux Python
developer community and the macOS ObjC developer community). People also tend
to be more productive using the tools or programming languages they like and
are familiar with. Some of the tools and programming languages might also
actually have some nice features, get certain things right, or solved certain
problems in novel ways. By learning from and studying the tools and programming
language of other communities, one can help improve their own community's
tools and programming languages. This is called "Cross Pollination".

Instead of chasing the impossible dream of rigid standardization, just let
people research and pick their own preferred tools and programming languages.

## In Conclusion

I hope you, the reader, now understands the common reasons why
some people in the InfoSec community have an oddly strong dislike of Ruby.
I also hope that I have debunked many of these reasons and shown that it is a
waste of time/energy to continue complaining about Ruby.

If you do not like Ruby, then simply do not use it. Problem solved.
You do not have to constantly remind everyone that you do not
like something. Also, please do not troll or harass other Ruby programmers,
simply because they like a programming language that you do not.
Use whatever programming language you prefer and enjoy it.

If you don't know about Ruby or haven't tried it yet, [check it out][try-ruby]
and form your own opinions.

Cheers

[ruby]: https://www.ruby-lang.org/
[try-ruby]: https://try.ruby-lang.org/
