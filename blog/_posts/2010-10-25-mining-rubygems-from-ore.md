---
layout: post
title: Mining RubyGems from Ore
tags:
 - ruby
 - rubygems
 - gemspec
 - ore
---

Recently there has been some interesting discussion on the role of
Gem builders and gemspecs. [Jeff Kreeftmeijer](http://jeffkreeftmeijer.com/)
wrote about how easy it is to build a RubyGem using a hand-written
`.gemspec` file. With just a stand-alone `.gemspec` file one can:

* Build RubyGems: `gem build my-project.gemspec`.
* Publish RubyGems: `gem push my-project-0.1.0.gem`.

One thing worries me is the fact that you either have to specify
everything explicitly in the gemspec, or use inline `git` commands to query
the files of a project. Copying and pasting all this boilerplate code around
seems like a potential future maintenance hassle; also not very DRY.

The argument for just a `.gemspec` file did get me thinking. I do find
myself regenerating the gemspec with
[Jeweler](http://github.com/technicalpickles/jeweler), almost once per-day.
Also, these stand-alone gemspecs are pretty succinct. So when in doubt,
see how other languages solved the problem.

## Code vs. Data

I asked one of my Haskell friends how [Cabal](http://www.haskell.org/cabal/)
(the Haskell packager of choice) solves this problem. He pointed me
to the [Cabal file](http://hpaste.org/40862/serialistnet_cabal_file) of his
Haskell webapp [serialist.net](http://serialist.net/). Cabal uses easy to
read, easy to parse and easy to edit **plain-text**. This reminded me,
Code is for describing logic and flat-files are for describing static data.
The majority of the information in the `.gemspec` file, is static data.

Now I am starting to really question the whole reason for an explicit
gemspec. The `.gemspec` file only exists to create a
[Gem::Specification](http://rubygems.rubyforge.org/rubygems-update/Gem/Specification.html)
object, which is then passed to [Gem::Builder](http://rubygems.rubyforge.org/rubygems-update/Gem/Builder.html)
or loaded by [Bundler](http://gembundler.com/). Why are we writing Ruby
code that normally would only exist in-memory? The gemspec purists
state this is to allow things such as, dynamically loading the `VERSION`
constant from the project or dynamically listing files tracked by Git.
Although, both of these tasks can easily be automated by a library.

So I wondered, why not have a small library that loads the project
information from a YAML file, fills in any missing information, and then
creates a new `Gem::Specification` object. Furthermore, If we can call a
method and get a `Gem::Specification` object back, we could place this in
the `.gemspec` file for both `gem build` and Bundler to make use of.

## Introducing Ore

[Ore](http://github.com/ruby-ore/ore) allows you to define all project
information for a RubyGem in a **single YAML file** (`gemspec.yml`).

    name: ore
    version: 0.1.2
    summary: Cut raw RubyGems from YAML
    description:
      Ore is a simple RubyGem building solution. Ore handles the
      creation of Gem::Specification objects as well as building '.gem'
      files. Ore allows the developer to keep all of the project information
      in a single YAML file.
    
    license: MIT
    authors: Postmodern
    email: postmodern.mod3@gmail.com
    homepage: http://github.com/postmodern/ore
    has_yard: true
    
    dependencies:
      thor: ~> 0.14.3
    
    development_dependencies:
      yard: ~> 0.6.1
      rspec: ~> 2.0.0

With Ore, one can write their description as free-text, no more using
with awkward Ruby `%Q{...}` syntax.

Dependencies are listed in a YAML Hash, no more repeating `add_dependency`
or `add_development_dependency`.

Ore can also infer missing information. If the `version` is not specified,
Ore will search for and parse any `VERSION` or `VERSION.yml` files. Ore
can even slurp up any `VERSION`, `MAJOR`, `MINOR`, `PATCH` or `BUILD`
constants from a `version.rb` file in the `lib/` directory. Also, notice
that `files` is not listed, this is because Ore can detect the project is
using Git, and list all files tracked by Git.

For a complete reference of everything that may go into a `gemspec.yml`
file, and how Ore infers missing data, please see
[GemspecYML](http://rubydoc.info/gems/ore-core/file/GemspecYML.md).

Building gems with Ore is easy as:

    $ ore
    Successfully built RubyGem
    Name: ore
    Version: 0.1.2
    File: ore-0.1.2.gem
    $ ls pkg/
    ore-0.1.2.gem

One can still get the traditional gemspec from Ore:

    $ ore gemspec
    # -*- encoding: utf-8 -*-
    
    Gem::Specification.new do |s|
      s.name = %q{ore}
      s.version = "0.1.2"
    
      s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
      s.authors = ["Postmodern"]
      s.date = %q{2010-10-25}
      s.default_executable = %q{ore}
    ...

We can even use Ore in `.gemspec` files:

    # -*- encoding: utf-8 -*-
    
    begin
      Ore::Specification.new do |gemspec|
        # custom logic here
      end
    rescue NameError
      begin
        require 'ore/specification'
        retry
      rescue LoadError
        STDERR.puts "The 'my-project.gemspec' file requires Ore."
        STDERR.puts "Run `gem install ore-core` to install Ore."
      end
    end

Ore will still work with `gem build` and even Bundler.

## Mining RubyGems from Ore

Ore also comes with an extendable generator, for creating new projects:

    $ mine my-project
    Generating /home/hal/my-project
      create  lib
      create  lib/my/project
      create  spec
      create  .rspec
      create  spec/my/project_spec.rb
      create  spec/spec_helper.rb
      create  .document
      create  .gitignore
      create  my-project.gemspec
      create  ChangeLog.rdoc
      create  LICENSE.txt
      create  README.rdoc
      create  Rakefile
      create  gemspec.yml
      create  lib/my/project/version.rb
      create  lib/my/project.rb
         run  git init from "."
         run  git add . from "."
         run  git commit -m "Initial commit." from "."

By default `mine` will generate an RDoc and test-unit project. `mine`
can also generate very customized projects:

    $ mine my-project --rspec --yard --markdown --bundler
    Generating /home/hal/my-project
          create  lib
          create  lib/my/project
          create  spec
          create  .yardopts
          create  .rspec
          create  spec/my/project_spec.rb
          create  spec/spec_helper.rb
          create  Gemfile
          create  .document
          create  .gitignore
          create  my-project.gemspec
          create  ChangeLog.md
          create  LICENSE.txt
          create  README.md
          create  Rakefile
          create  gemspec.yml
          create  lib/my/project/version.rb
          create  lib/my/project.rb
             run  git init from "."
             run  git add . from "."
             run  git commit -m "Initial commit." from "."

`mine` simply renders Ore Templates. Unlike other generators which have
their logic hard-coded in Ruby, Ore Templates are simply
[directories](http://github.com/ruby-ore/ore/tree/master/data/ore/templates/),
containing static and ERb files. One can make their own Ore template
by creating a directory, adding files and publishing a Git repository.

Users can install custom Ore templates from Git repositories:

    $ ore install http://github.com/user/awesometest.git
    $ ore list
    Builtin templates:
      base
      rspec
      test_unit
      yard
      bundler
      jeweler_tasks
      rdoc
      ore_tasks
    Installed templates:
      awesometest

Then use the `-T` option to specify additional custom templates:

    $ mine my-project --yard --markdown -T awesometest

## Workflow

By default Ore does not impose a workflow onto the developer. Even the `mine`
utility does not add any additional Rake tasks to new projects. This allows the
developer to use `gem build` and `gem push`, or even use
[Jeweler::Tasks](http://github.com/technicalpickles/jeweler) with Ore.

For those just wanting simple Rake tasks to build, push and tag releases, there
is [ore-tasks](http://github.com/ruby-ore/ore-tasks). `Ore::Tasks` provides
the following tasks:

    rake build            # Only builds a Gem
    rake console[script]  # Start IRB with all runtime dependencies loaded
    rake gem              # Alias to the 'build' task
    rake install          # Builds and installs a Gem
    rake push             # Builds and pushes a Gem
    rake release          # Builds and Pushes a new Gem / Build, Tags and Pushe...
    rake tag              # Tags a release and pushes the tag
    rake version          # Displays the current version

To generate a project with `Ore::Tasks` included:

    $ mine my-project --ore-tasks

To generate a project with `Jeweler::Tasks` included:

    $ mine my-project --jeweler-tasks

## Dog Fooding

In order to do real-world testing with Ore, I created
[ore-example](http://github.com/ruby-ore/ore-example) which uses Bundler,
RSpec2, YARD and Ore::Tasks.

As of now, I have also migrated my
[chars](http://github.com/postmodern/chars) and
[uri-query_params](http://github.com/postmodern/uri-query_params)
libraries to Ore.

## Interested?

    $ gem install ore
    $ mine the-future

For questions or feedback, join `#ruby-ore` on `irc.freenode.net`.

All source-code is located on [GitHub](http://github.com/ruby-ore).

Ore is tested with [RSpec2](http://rspec.info/) and has extensive
[YARD](http://yardoc.org) [documentation](http://rubydoc.info/gems/ore).
