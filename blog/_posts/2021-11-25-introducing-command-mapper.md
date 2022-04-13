---
layout: post
title: Introducing command_mapper
tags:
 - ruby
 - command
 - shell
 - library
 - security
 - command_mapper
 - command_mapper-gen
---

## The Problem

Normally in Ruby if you need to write a method which accepts one or more
arguments and executes a command, you would write something like this:

```ruby
def git_pull(branch)
  system("git pull origin #{branch}")
end
```

However, there are a few problems with the above code:

* Does not validate the input
  (ex: `git_pull(nil)`, `git_pull("")`, `git_pull(true)`, `git_pull(false)`,
  `git_pull([1,2,3])`, `git_pull({1=>2})`, etc).
* Vulnerable to arbitrary command injection
  (ex: `git_pull(";evil_command_here#")`).
* Vulnerable to arbitrary option injection
  (ex: `git_pull("--option-that-gives-an-attacker-control branch")`).

A better version of the above code might look like this:

```ruby
def git_pull(branch)
  args = %w[git pull origin]
  args << branch.to_s if branch
  system(*args)
end
```

Better. We have fixed the arbitrary command injection by passing multiple
arguments to [Kernel#system], which executes the command as its own sub-process,
not in a sub-shell. We also added very basic validations for `branch`. However,
those basic validations are not enough and the above code is still vulnerable to
option injection via `branch` or any additional argument that is appended to
`args`. It would take a lot of work to add support for all of `git pull`'s
other options and arguments, and add validations for each of them.

[Kernel#system]: https://rubydoc.info/stdlib/core/Kernel#system-instance_method

## The Solution

[command_mapper] is a new library for mapping external commands to Ruby classes.

[command_mapper]: https://rubydoc.info/gems/command_mapper

```ruby
require 'command_mapper/command'

#
# Represents the `grep` command
#
class Grep < CommandMapper::Command

  command "grep" do
    option "--extended-regexp"
    option "--fixed-strings"
    option "--basic-regexp"
    option "--perl-regexp"
    option "--regexp", equals: true, value: true
    option "--file", name: :patterns_file, equals: true, value: true
    option "--ignore-case"
    option "--no-ignore-case"
    option "--word-regexp"
    option "--line-regexp"
    option "--null-data"
    option "--no-messages"
    option "--invert-match"
    option "--version"
    option "--help"
    option "--max-count", equals: true, value: {type: Num.new}
    option "--byte-offset"
    option "--line-number"
    option "--line-buffered"
    option "--with-filename"
    option "--no-filename"
    option "--label", equals: true, value: true
    option "--only-matching"
    option "--quiet"
    option "--binary-files", equals: true, value: true
    option "--text"
    option "-I", name: 	# FIXME: name
    option "--directories", equals: true, value: true
    option "--devices", equals: true, value: true
    option "--recursive"
    option "--dereference-recursive"
    option "--include", equals: true, value: true
    option "--exclude", equals: true, value: true
    option "--exclude-from", equals: true, value: true
    option "--exclude-dir", equals: true, value: true
    option "--files-without-match", value: true
    option "--files-with-matches"
    option "--count"
    option "--initial-tab"
    option "--null"
    option "--before-context", equals: true, value: {type: Num.new}
    option "--after-context", equals: true, value: {type: Num.new}
    option "--context", equals: true, value: {type: Num.new}
    option "--group-separator", equals: true, value: true
    option "--no-group-separator"
    option "--color", equals: :optional, value: {required: false}
    option "--colour", equals: :optional, value: {required: false}
    option "--binary"

    argument :patterns
    argument :file, required: false, repeats: true
  end

end
```

## Type System

An observant reader will notice `type: Num.new` in the above example code.
All option values and arguments may have a type. All options and arguments
default to the [Str][CommandMapper::Types::Str] type. These types define their
own validation and formatting rules. The available types are:

* [Str][CommandMapper::Types::Str]: string values
* [Num][CommandMapper::Types::Num]: numeric values
* [Hex][CommandMapper::Types::Hex]: hexadecimal values
* [Map][CommandMapper::Types::Map]: maps `true`/`false` to `yes` or `no`, or
  `enabled` or `disabled` (aka `--opt=yes|no` or `--opt=enabled|disabled`
  values).
* [Enum][CommandMapper::Types::Enum]: maps a finite set of Symbols to
  a finite set of Strings (aka `--opt={foo|bar|baz}` values).
* [List][CommandMapper::Types::List]: comma-separated list
  (aka `--opt VALUE,...`).
* [KeyValue][CommandMapper::Types::KeyValue]: maps a Hash or Array to key:value
  Strings (aka `--opt KEY:VALUE` or `--opt KEY=VALUE` values).
* [KeyValueList][CommandMapper::Types::KeyValueList]: a key-value list
  (aka `--opt KEY:VALUE,...` or  `--opt KEY=VALUE;...` values).
* [InputPath][CommandMapper::Types::InputPath]: a path to a pre-existing file or
  directory
* [InputFile][CommandMapper::Types::InputFile]: a path to a pre-existing file
* [InputDir][CommandMapper::Types::InputDir]: a path to a pre-existing directory

[CommandMapper::Types::Str]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/Str
[CommandMapper::Types::Num]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/Num
[CommandMapper::Types::Hex]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/Hex
[CommandMapper::Types::Map]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/Map
[CommandMapper::Types::Enum]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/Enum
[CommandMapper::Types::List]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/List
[CommandMapper::Types::KeyValue]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/KeyValue
[CommandMapper::Types::KeyValueList]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/KeyValueList
[CommandMapper::Types::InputPath]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/InputPath
[CommandMapper::Types::InputFile]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/InputFile
[CommandMapper::Types::InputDir]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/InputDir

### Custom Types

Custom type classes can be defined by simply inheriting from
[CommandMapper::Types::Type] then defining `validate` and `format` instance
methods.

[CommandMapper::Types::Type]: https://rubydoc.info/gems/command_mapper/CommandMapper/Types/Type

```ruby
class PortRange < CommandMapper::Types::Type

  def validate(value)
    case value
    when Integer
      true
    when Range
      if value.begin.kind_of?(Integer)
        true
      else
        [false, "port range can only contain Integers"]
      end
    else
      [false, "port range must be an Integer or a Range of Integers"]
    end
  end

  def format(value)
    case value
    when Integer
      "#{value}"
    when Range
      "#{value.begin}-#{value.end}"
    end
  end

end
```

Then the custom type class can then be passed to any `type:` keyword argument:

```ruby
option :ports, value: {required: true, type: PortRange.new}
```

## Running Commands

Once a [CommandMapper::Command] class has been defined, it can then map the
class's attributes back to the command's option flags, additional arguments,
or subcommands, and then safely executed via [system()]:

[CommandMapper::Command]: https://rubydoc.info/gems/command_mapper/CommandMapper/Command
[system()]: https://rubydoc.info/stdlib/core/Kernel#system-instance_method

```ruby
Grep.run(ignore_case: true, patterns: "foo", file: "file.txt")
```

Commands can also be initialized with a block and executed:

```ruby
Grep.run do |grep|
  grep.ignore_case = true
  grep.patterns    = "foo"
  grep.file        = "file.txt"
end
```

**Note:** that if a required argument does not have a value or if an invalid
value is given to an option or argument, a validation error will be raised:

```ruby
Grep.run(file: 'file.txt')
# /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:494:in `block in command_argv': argument patterns is required (CommandMapper::ArgumentRequired)
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:490:in `each'
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:490:in `command_argv'
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:537:in `run_command'
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:108:in `run'
```

Output from the command can also be captured (similar to <kbd>\`...\`</kbd>):

```ruby
Grep.capture(ignore_case: true, patterns: "foo", file: "file.txt")
# => "..."
```

Output from the command can also be read via `IO.popen`:

```ruby
Grep.popen(ignore_case: true, patterns: "foo", file: "file.txt")
# => #<IO:...>
```

The command can also be ran under `sudo` (see the [CommandMapper::Sudo]
class):

[CommandMapper::Sudo]: https://rubydoc.info/gems/command_mapper/CommandMapper/Sudo

```ruby
Grep.sudo(patterns: "Error", file: "/var/log/syslog")
# Password: 
# ...
```

Finally, the command can even be safely embedded in another command string:

```ruby
gre[ = Grep.new(ignore_case: true, patterns: "foo", file: "file.txt")
cmd = "#{grep} | less"
system(cmd)
```

## Security

In order to prevent arbitrary option injection, option will explicitly not
allow values that begin with a `-`:

```ruby
Grep.run(label: '--injected-option', patterns: 'foo', file: 'test.txt')
# /home/postmodern/code/command_mapper.rb/lib/command_mapper/option.rb:273:in `emit_option_flag_and_value': option label formatted value ("--injected-option") cannot start with a '-' (CommandMapper::ValidationError)
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/option.rb:164:in `argv'
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:485:in `block in command_argv'
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:483:in `each'
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:483:in `command_argv'
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:542:in `run_command'
# 	from /home/postmodern/code/command_mapper.rb/lib/command_mapper/command.rb:108:in `run'
```

In order to prevent arbitrary command injection, any special shell characters
in the command's option or argument values will automatically be escaped using
[Shellwords]\:

```ruby
grep = Grep.new(patterns: ';injected_command#', file: 'test.txt')
grep.command_string
# => "grep \\;injected_command\\# test.txt"
```

[Shellwords]: https://rubydoc.info/stdlib/shellwords/Shellwords

## But Wait, There's More!

Now you might be thinking "gee that's still a lot to type, must be tedious to
setup", and you'd be right. That's where [command_mapper-gen] comes in. The
`command_mapper-gen` CLI utility can parse a command's `--help` output and/or
man page, and automatically generate the above code:

[command_mapper-gen]: https://github.com/postmodern/command_mapper-gen.rb#readme

```
$ command_mapper-gen grep
Failed to parse line in `grep --help`:

    -NUM                      same as --context=NUM

Failed to match sequence (('	' / SPACES) OPTION ','? ([ \\t]{1, } OPTION_SUMMARY)? !.) at line 1 char 5.

require 'command_mapper/command'

#
# Represents the `grep` command
#
class Grep < CommandMapper::Command

  command "grep" do
    option "--extended-regexp"
    option "--fixed-strings"
    option "--basic-regexp"
    option "--perl-regexp"
    option "--regexp", equals: true, value: true
    option "--file", equals: true, value: true
    option "--ignore-case"
    option "--no-ignore-case"
    option "--word-regexp"
    option "--line-regexp"
    option "--null-data"
    option "--no-messages"
    option "--invert-match"
    option "--version"
    option "--help"
    option "--max-count", equals: true, value: {type: Num.new}
    option "--byte-offset"
    option "--line-number"
    option "--line-buffered"
    option "--with-filename"
    option "--no-filename"
    option "--label", equals: true, value: true
    option "--only-matching"
    option "--quiet"
    option "--binary-files", equals: true, value: true
    option "--text"
    option "-I", name: 	# FIXME: name
    option "--directories", equals: true, value: true
    option "--devices", equals: true, value: true
    option "--recursive"
    option "--dereference-recursive"
    option "--include", equals: true, value: true
    option "--exclude", equals: true, value: true
    option "--exclude-from", equals: true, value: true
    option "--exclude-dir", equals: true, value: true
    option "--files-without-match", value: true
    option "--files-with-matches"
    option "--count"
    option "--initial-tab"
    option "--null"
    option "--before-context", equals: true, value: {type: Num.new}
    option "--after-context", equals: true, value: {type: Num.new}
    option "--context", equals: true, value: {type: Num.new}
    option "--group-separator", equals: true, value: true
    option "--no-group-separator"
    option "--color", equals: :optional, value: {required: false}
    option "--colour", equals: :optional, value: {required: false}
    option "--binary"

    argument :patterns
    argument :file, required: false, repeats: true
  end

end
```

## Importance to the Ruby Ecosystem

Beyond providing a Ruby interface to external commands, and preventing
arbitrary command injection, [command_mapper] and [command_mapper-gen] allows
Ruby to interface with other CLI utilities written in other programming
language ecosystems that Ruby cannot bind to, such as Go or Rust.

Using [command_mapper] we can automate other CLI utilities, written in Go or
Rust, parse their output or output files, all seamlessly from Ruby as if you
were calling another Ruby library.
