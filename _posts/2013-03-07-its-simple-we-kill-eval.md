---
layout: post
title: "It's simple, we kill eval"
tags:
 - ruby
 - security
---

<img class="span-18" src="/images/2013/03/07/its-simple-we-kill-eval/joker.jpg" alt="It's simple, we kill eval()"/>

## ... with define_method

In [@tenderlove]'s blog post on [dynamic method definitions][1], he dispels the
old myth that `define_method` is slower than `module_eval`/`class_eval`.
This myth has caused Ruby developers to prefer using `module_eval`/`class_eval`
with String substitution to dynamically define methods:

    def define_custom_reader(name)
      module_eval do
        def #{name}
          get_data("#{name}")
        end
      end
    end

The problem with the above code is that if user-input is passed to
`define_custom_reader`, it allows an attacker to inject arbitrary Ruby code.
If we rewrite the above code using `define_method`, we prevent code injection:

    def define_custom_reader(name)
      define_method name do
        get_data(name)
      end
    end

Now `define_custom_reader` will define a method using `name`, and when the
method is called it will call `get_data` with `name`.

Why doesn't every Rubyist use `define_method`? One reason was the myth about
the performance impact. The other was that blocks could not accept other blocks
in 1.8.x. This prevented Rubyists from using `define_method` to define methods
that accept blocks. However, blocks _can_ accept other blocks in 1.9.x:

    define_method name do |&block|
      value = get_data(name)
      block.call(value) if block
      value
    end

Given that Ruby 1.8.7 will officially reach [End-of-Life][3] in June,
Ruby developers _should_ be upgrading to Ruby 1.9.3 or 2.0.0.
In fact, according to RubyGems.org [statistics][2] the majority of Rubyists
have already upgraded to 1.9.x. There is no excuse not to use `define_method`
for your metaprogramming needs.

## metaid.rb

As depicted above `define_method` works great for defining instance methods.
If you want to define class methods with `define_method`, you must open
the metaclass:

    class << self
      define_method name do
        # ...
      end
    end

The `class << self` syntax can be cumbersome. To alleviate this, there are
a set of helper methods called [metaid]:

    meta_def name do
      # ...
    end

Much cleaner!

## It's time to kill eval

`eval` is a security risk and is not needed in most cases. It's time to kill
`eval` before it causes another Remote Code Execution (RCE) vulnerability.
While we cannot remove `eval` from Ruby itself, we can remove it from our code.

**Challenge:** grep through as much Ruby code as possible looking for
`_eval [%\"]`, and replace as many instances as possible with `define_method`:

    $ egrep -r "_eval [%\"]" */lib/

[@tenderlove]: https://twitter.com/tenderlove
[metaid.rb]: https://github.com/defunkt/metaid/blob/master/metaid.rb

[1]: http://tenderlovemaking.com/2013/03/03/dynamic_method_definitions.html
[2]: https://twitter.com/drbrain/status/301884264214065152
[3]: https://blog.engineyard.com/2012/ruby-1-8-7-and-ree-end-of-life
