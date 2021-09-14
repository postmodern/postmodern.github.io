---
layout: post
title: RubyGems Tasks
tags:
  - rubygems
  - tasks
  - gemspec
---

<div class="warning">
  <h3>Warning: Controversial Content</h3>

  <p>
  If you are morally or ethically opposed to building/releasing Ruby Gems
  with <code>rake</code>, this blog post may anger you. If this is the case,
  you are advised to STOP READING and CLICK THE BACK BUTTON.
  </p>
</div>

Ever since we could release Ruby Gems, we have had Gem helpers that
could generate new projects and provided Rake tasks to automate the
building/publishing of Gems. The most popular of these Gem helpers were [Hoe]
and [Jeweler]. Both [Hoe] and [Jeweler] required a certain project layout and
imposed a certain workflow onto the developer.

Sometime before the [introduction][1] of [Bundler], Yehuda Katz [proposed][2]
a radically simpler way of building Gems, using the [gemspec] file.
Developers could use the built-in `gem build` command to build a `.gem` file
from a `.gemspec`, and use the `gem push` command to publish the Gem to
[rubygems.org]. This marked the start of an exodus of sorts,
away from using Gem helpers such as [Hoe] and [Jeweler].

## All you need is a Gemspec?

With the advent of building gems from a `.gemspec`, a vocal minority formed
within the Ruby community. They proclaimed that all one needs is a gemspec,
and that all other tools ([Hoe], [Jeweler], [Bundler] and even [Rake])
are now obsolete!

Let us take a look at how they might release a Gem:

    $ git status
    $ git push
    $ gem build my_project.gemspec
    $ gem push my_project-1.2.3.gem
    $ git tag 1.2.3
    $ git push --tags

It takes roughly **six** commands to release a Gem to [rubygems.org].
A developer must remember to run each of these six commands, in order,
every time they release a new version of their Gem. The possibility for human
error increases.

In fact, I have found Gems that contained newer source-code than their Git
repository; because the developer forgot to commit or push the changes
before pushing the Gem. I have also found Git repositories with no tags,
making it difficult to review what exactly changed between versions.

Now, let us see how developers release gems using [Rake] tasks:

    $ rake release

That's it! That one command will run each of the above **six** commands.
If any of the commands fail, the release process will halt.
If there are uncommitted changes, the release process will halt.
The possibility for human error has been greatly minimized.

## Alternatives

Having used [Hoe], [Jeweler] and then [Bundler], I missed some of the
workflow provided by these Gem helpers. So I began searching for lightweight
alternatives.

I looked at [Gem::PackageTask], [MG], [gem release] and even
[bundler/gem_helper]. Unfortunately they all were missing various features.
[Gem::PackageTask] only built the `.gem` file, but did not check `git status`,
tag the release or push the `.gem`.
[MG] also did not check `git status` before releasing,
did not tag releases, and only supports Git. [gem release] came close,
but did not check `git status` before releasing, deleted the `.gem` file,
only supports Git and tried to do too much
(auto-magically bumping the version of your project for you).
[bundler/gem_helper] came the closest, although while it defined [Rake] tasks
it did not leverage Rake's powerful [task => dependency][3] system.

So I decided to cherry-pick all of the nice features from [Hoe], [Jeweler],
[MG], [gem release] and [bundler/gem_helper], and leave out the
_opinionated_ features.

## rubygems-tasks

[rubygems-tasks] provides agnostic and unobtrusive Rake tasks for building,
installing and releasing Ruby Gems.

    $ gem install rubygems-tasks

Adding rubygems-tasks to an existing project is easy as:

    require 'rubygems/tasks'
    Gem::Tasks.new

    $ rake -T
    rake build    # Builds all packages
    rake console  # Spawns an Interactive Ruby Console
    rake install  # Installs all built gem packages
    rake release  # Performs a release

### Features

* Provides tasks to build, install and push gems to [rubygems.org]:
  * Loads all project metadata from the `.gemspec` file.
  * Supports loading multiple `.gemspec` files.
  * Supports pushing gems to alternate [Gemcutter] servers.
* Supports optionally building `.tar.gz` and `.zip` archives.
* Supports [Git], [Mercurial] and [SubVersion] SCMs.
  * Supports creating [PGP] signed Git/Mercurial tags.
* Supports generating checksums of built packages:

      Gem::Tasks.new(:sign => {:checksum => true})

* Supports generating [PGP] signatures for built packages:

      Gem::Tasks.new(:sign => {:pgp => true})

* Provides a `console` task, for jumping right into your code.
* Defines task aliases for users coming from [Jeweler] or [Hoe].
* ANSI coloured messages!

### Anti-Features

* **Does not** parse project metadata from the README or the ChangeLog.
* **Does not** generate or modify your code.
* **Does not** automatically commit changes.
* **Does not** inject dependencies into gems.
* **Zero** dependencies.

### Examples

Specifying an alternate Ruby Console to run:

    Gem::Tasks.new do |tasks|
      tasks.console.command = 'pry'
    end

Enable pushing gems to an in-house [Gemcutter] server:

    Gem::Tasks.new do |tasks|
      tasks.push.host = 'gems.company.com'
    end

Disable the `push` task:

    Gem::Tasks.new(:push => false)

Enable building `.tar.gz` and `.zip` archives:

    Gem::Tasks.new(:build => {:tar => true, :zip => true})

Enable Checksums and [PGP] signatures for built packages:

    Gem::Tasks.new(:sign => {:checksum => true, :pgp => true})

Selectively defining tasks:

    Gem::Build::Tar.new
    Gem::SCM::Status.new
    Gem::SCM::Tag.new(:format => 'REL-%s')
    Gem::Sign::Checksum.new
    Gem::Console.new

[Rake]: http://rake.rubyforge.org/
[Hoe]: http://www.zenspider.com/projects/hoe.html
[Jeweler]: https://github.com/technicalpickles/jeweler#readme
[Bundler]: http://gembundler.com
[gemspec]: http://docs.rubygems.org/read/chapter/20

[rubygems.org]: https://rubygems.org/
[Gemcutter]: https://github.com/rubygems/rubygems.org#readme

[Gem::PackageTask]: http://rubygems.rubyforge.org/rubygems-update/Gem/PackageTask.html
[MG]: https://github.com/sr/mg#readme
[gem release]: https://github.com/svenfuchs/gem-release#readme
[bundler/gem_helper]: https://github.com/bundler/bundler/blob/master/lib/bundler/gem_helper.rb
[rubygems-tasks]: https://github.com/postmodern/rubygems-tasks#readme

[Git]: http://git-scm.com/
[Mercurial]: http://mercurial.selenic.com/
[SubVersion]: http://subversion.tigris.org/

[PGP]: http://en.wikipedia.org/wiki/Pretty_Good_Privacy

[1]: http://yehudakatz.com/2010/09/30/bundler-as-simple-as-what-you-did-before/
[2]: http://yehudakatz.com/2010/04/02/using-gemspecs-as-intended/
[3]: http://jasonseifer.com/2010/04/06/rake-tutorial
