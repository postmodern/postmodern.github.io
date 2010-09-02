---
layout: post
title: Introducing uri-query_params
---

[uri-query_params](http://github.com/postmodern/uri-query_params) is a new
library which allows accessing the individual parameters in the query
string of a HTTP URI in Ruby. The library
[monkey-patches](http://en.wikipedia.org/wiki/Monkey_patch) the `URI::HTTP`
class to provide similar behavior to PHPs famous `$_GET` hash.

    $ gem install uri-query_params

Using `uri-query_params` you can, inspect the URI query_params:

    require 'uri/query_params'
    
    url = URI('http://www.google.com/search?hl=en&client=firefox-a&rls=org.mozilla%3Aen-US%3Aofficial&hs=1HY&q=bob+ross&btnG=Search')
    
    url.query_params
    # => {"btnG"=>"Search", "hs"=>"1HY", "rls"=>"org.mozilla:en-US:official", "client"=>"firefox-a", "hl"=>"en", "q"=>"bob+ross"}

    url.query_params['q']
    # => "bob+ross"

Also, set the URI query_params:

    url.query_params['q'] = 'Upright Citizens Brigade'
    url.to_s
    # => "http://www.google.com/search?btnG=Search&hs=1HY&rls=org.mozilla:en-US:official&client=firefox-a&hl=en&q=Upright%20Citizens%20Brigade"

Originally, the [URI::QueryParams](http://rubydoc.info/gems/uri-query_params/URI/QueryParams/Mixin)
mixin was developed for [Ronin](http://ronin-ruby.github.com/) and
[GScraper](http://github.com/postmodern/gscraper/). I decided to split the
code out into a common library, to prevent conflicts between the two
separate versions.

Enjoy.
