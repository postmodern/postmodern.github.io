---
layout: post
title: Introducing OpenNamespace
tags:
  - ruby
  - namespace
  - autoload
---

I have always liked how frameworks such as Rails can
[autoload](http://www.rubyinside.com/ruby-techniques-revealed-autoload-1652.html)
Classes. I wanted to provide similar behavior in
[Ronin](http://ronin-ruby.github.com/) and other frameworks, so I created
the [OpenNamespace](http://github.com/postmodern/open_namespace) library.

[OpenNamespace](http://rubydoc.info/gems/open_namespace) allows namespaces
to require and find classes and modules from RubyGems. Using `OpenNamespace`
you can make a `Plugins` module able to load plugin modules/classes from
other gems.

More specifically, `OpenNamespace` does not need to know where
the files are, it just guesses the file path based on the constant name,
attempts to require it then finds the constant in the namespace.

    $ gem install open_namespace

## Examples

    require 'open_namespace'
    
    module Project
      module Plugins
        include OpenNamespace
      end
    end

Explicitly load constants:

    Project::Plguins.require_const :foo_bar
    # => Project::Plugins::FooBar

Explicitly load constants with odd capitalization:

    Project::Plugins.require_const :tcp_session
    # => Project::Plugins::TCPSession

Explicitly load constants via sub-paths:

    Project::Plguins.require_const 'templates/erb'
    # => Project::Plugins::Templates::Erb

Implicitly load constants via const_missing:

    Project::Plugins::Other
    # => Project::Plugins::Other

Enjoy.
