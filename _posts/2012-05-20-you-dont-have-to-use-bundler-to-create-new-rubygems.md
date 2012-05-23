---
layout: post
title: You don't have to use Bundler to create new RubyGems
tags:
  - ore
  - bundler
---

<div class="warning">
  <h3>Warning: Controversial Content</h3>

  <p>
  If you are morally or ethically opposed to using Project Generators
  and prefer to create RubyGems by hand,
  <strong>STOP READING AND CLICK THE BACK BUTTON</strong>.
  </p>

  <p>
  I am perfectly aware that one does not need any tools to create a RubyGem,
  and that all you really need is RubyGems and a <kbd>*.gemspec</kbd>
  file. However, the majority of users do not have the time or patience
  to create each Ruby project from scratch. Thus developers have historically
  used project <em>generators</em> such as Hoe, Jeweler and now Bundler.
  </p>

  <p>
  If you are a diehard Bundler user, please read the <em>entire</em> article.
  This article <strong>is not</strong> putting Bundler down,
  nor is it posing a binary choice between Bundler and some new tool.
  </p>
</div>

[Bundler] was initially created as a more robust way to [manage dependencies
of Rails3 applications][1]. Once Bundler was integrated
into the Rails3 generator templates, developers realized Bundler could also
be used to manage the dependencies of any large Ruby application or library.

In order to help developers create projects with Bundler already setup,
[template files][2] and a `bundle gem` command were added.
Since Bundler was the "new hotness" and developers were becoming increasingly
dissatisfied with [Jeweler]/[Hoe], the community began to
[cargo][3] [cult][4] Bundler as the defacto way to create RubyGems.

## Looking Back

After having extensively used [Bundler] with [Ronin][7], to keep it's many
[repositories][8] in-sync with each other, I can definitely say Bundler
solved dependency management for large Ruby projects.
However, I began to question using `bundle gem` to create new RubyGems.

At first it made sense to provide a `bundle gem` command, but project
generation is outside of the original scope of Bundler (dependency management).
Furthermore, adding Bundler to an existing project isn't that difficult;
just add a `.gemspec` file and a `Gemfile`.

Given that [Bundler]'s stated goal is to "manage an application's dependencies",
it doesn't seem very pragmatic to use Bundler in libraries with
**zero** or only **one** runtime dependency.

Bundler's [template files][2] are a bit spartan as well.
The [Rakefile][5] template does not include Rake tasks for [RDoc] or [RSpec].
This omission might encourage developers to not write documentation or tests,
and rush to release.

The `bundle gem` command isn't very configurable either. If you want to generate
a project with [Textile] markup, [YARD] documentation, [RSpec] tests and
[Mercurial][hg], you are out of luck.

<img class="span-18" src="/images/2012/05/20/you-dont-have-to-use-bundler-to-create-new-rubygems/morpheus.jpg" />

## Enter Ore

> [Ore] is a flexible Ruby project generator. Unlike other Ruby project
> generators, Ore provides many built in templates and allows custom templates
> to be installed from Git repositories.

    $ gem install ore
    $ mine my_project
    Generating /home/postmodern/my_project
          create  lib
          create  lib/my_project
          create  spec
          create  .gitignore
          create  .rspec
          create  spec/my_project_spec.rb
          create  spec/spec_helper.rb
          create  .document
          create  my_project.gemspec
          create  ChangeLog.rdoc
          create  LICENSE.txt
          create  README.rdoc
          create  Rakefile
          create  lib/my_project/version.rb
          create  lib/my_project.rb
             run  git init from "."
             run  git add . from "."
             run  git commit -m "Initial commit." from "."
    $ cd my_project/
    $ rake -T
    rake build         # Builds all packages
    rake clobber_rdoc  # Remove RDoc HTML files
    rake console       # Spawns an Interactive Ruby Console
    rake install       # Installs all built gem packages
    rake rdoc          # Build RDoc HTML files
    rake release       # Performs a release
    rake rerdoc        # Rebuild RDoc HTML files
    rake spec          # Run RSpec code examples

Ore generates new Ruby projects with sensible defaults, such as
a `.gemspec` file, [rubygems-tasks], [RDoc], [RSpec], a `.gitignore` file
and initializes the [Git][git] repository.

Ore also provides many different templates and options:

    $ mine --help
    Usage:
      mine PATH
    
    Options:
          [--gemspec-yml]               
          [--jeweler-tasks]             
          [--bundler]                   
          [--rubygems-tasks]            
                                        # Default: true
          [--yard]                      
          [--bundler-tasks]             
          [--hg]                        
          [--rspec]                     
                                        # Default: true
          [--rvmrc]                     
          [--gem-test]                  
          [--gem-package-task]          
          [--gemspec]                   
                                        # Default: true
          [--test-unit]                 
          [--git]                       
                                        # Default: true
          [--bin]                       
          [--rdoc]                      
                                        # Default: true
          [--markdown]                  
          [--textile]                   
      -T, [--templates=TEMPLATE [...]]  
      -n, [--name=NAME]                 
      -V, [--version=VERSION]           
                                        # Default: 0.1.0
      -s, [--summary=SUMMARY]           
                                        # Default: TODO: Summary
      -D, [--description=DESCRIPTION]   
                                        # Default: TODO: Description
      -a, [--authors=NAME [...]]        
                                        # Default: ["postmodern"]
      -e, [--email=EMAIL]               
      -U, [--homepage=HOMEPAGE]         
      -B, [--bug-tracker=BUG_TRACKER]   
      -L, [--license=LICENSE]           
                                        # Default: MIT

As you can see, Ore is completely configurable and supports:

* [Git][git] / [Mercurial][hg] / [SubVersion][svn]
* [.rvmrc] files
* [Bundler]
* [rubygems-tasks] / [Bundler tasks][bundler] / [Jeweler::Tasks][jeweler] /
  [Gem::PackageTask]
* [RSpec] / [Test::Unit]
* [YARD] / [RDoc] documentation
* [RDoc] / [Markdown] / [Textile] markup

Unlike other project generators, Ore focuses _only_ on project generation and
does not force a specific project layout or workflow upon the developer.
You can even generate projects with [Bundler], [YARD] + [Markdown] and
[Mercurial][hg] instead of [Git][git]:

    $ mine my_project --bundler --yard --markdown --hg
    Generating /home/postmodern/my_project
          create  lib
          create  lib/my_project
          create  spec
          create  .hgignore
          create  .document
          create  .yardopts
          create  Gemfile
          create  .rspec
          create  spec/my_project_spec.rb
          create  spec/spec_helper.rb
          create  my_project.gemspec
          create  ChangeLog.md
          create  LICENSE.txt
          create  README.md
          create  Rakefile
          create  lib/my_project/version.rb
          create  lib/my_project.rb
             run  hg init from "."
             run  hg add . from "."
             run  hg commit -m "Initial commit." from "."
    $ cd my_project && bundle install
    $ rake spec
    /home/postmodern/.rvm/rubies/ruby-1.9.3-p194/bin/ruby -S rspec ./spec/my_project_spec.rb
    
    MyProject
      should have a VERSION constant
    
    Finished in 0.00593 seconds
    1 example, 0 failures

## Think Outside of the Bundle

Now that you have been introduced to [Ore], I hope you will at the very least
give it a try. I also hope you will understand that I am not
simply anti-Bundler / pro-Ore. Ore gives you the option of generating Ruby
projects with/without Bundler. The two tools are not mutually exclusive.

[Bundler]: http://gembundler.org/
[Ore]: https://github.com/ruby-ore/ore#readme
[Hoe]: http://docs.seattlerb.org/hoe/

[git]: http://git-scm.com/
[hg]: http://mercurial.selenic.com/
[svn]: http://subversion.tigris.org/

[rubygems-tasks]: https://github.com/postmodern/rubygems-tasks#readme
[bundler]: http://gembundler.com/
[jeweler]: https://github.com/technicalpickles/jeweler#readme
[Gem::PackageTask]: http://rubygems.rubyforge.org/rubygems-update/Gem/PackageTask.html

[.rvmrc]: https://rvm.io/workflow/rvmrc/#project

[Rspec]: http://rspec.info/
[Test::Unit]: http://test-unit.rubyforge.org/

[YARD]: http://yardoc.org/
[RDoc]: http://rdoc.rubyforge.org/
[Markdown]: http://daringfireball.net/projects/markdown/
[Textile]: http://textile.sitemonks.com/

[1]: http://yehudakatz.com/2010/09/30/bundler-as-simple-as-what-you-did-before/
[2]: https://github.com/carlhuda/bundler/tree/master/lib/bundler/templates
[3]: http://railscasts.com/episodes/245-new-gem-with-bundler
[4]: https://github.com/radar/guides/blob/master/gem-development.md
[5]: https://github.com/carlhuda/bundler/blob/master/lib/bundler/templates/newgem/Rakefile.tt
[6]: https://github.com/carlhuda/bundler/blob/master/lib/bundler/templates/newgem/gitignore.tt
[7]: https://github.com/ronin-ruby/ronin/blob/master/Gemfile
[8]: https://github.com/ronin-ruby/
