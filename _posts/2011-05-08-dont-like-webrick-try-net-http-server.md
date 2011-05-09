---
layout: post
title: "Don't like WEBrick? Try net-http-server"
tags:
 - ruby
 - http
 - server
 - parslet
 - rack
---

## TL;DR

[net-http-server](http://github.com/postmodern/net-http-server):

    $ gem install net-http-server

* pure-Ruby HTTP [Parser](https://github.com/postmodern/net-http-server/blob/master/lib/net/http/server/parser.rb) and [Server](https://github.com/postmodern/net-http-server/blob/master/lib/net/http/server/daemon.rb)
* [Small codebase](https://github.com/postmodern/net-http-server/tree/master/lib)
* Fast-ish
* Rack-like API
* [Rack Handler](https://github.com/postmodern/net-http-server/blob/master/lib/rack/handler/http.rb) included
* [full YARD Documentation](http://rubydoc.info/gems/net-http-server/frames)

## WEBrick

Some have said that the [WEBrick](http://www.ruby-doc.org/stdlib/libdoc/webrick/rdoc/index.html)
HTTP Server is a [Ghetto](http://www.mikeperham.com/2010/11/22/the-ruby-stdlib-is-a-ghetto/).
While WEBrick is very fast for a pure-Ruby HTTP Server, the parsing code is
hand written and [difficult to read](https://github.com/ruby/ruby/blob/trunk/lib/webrick/httprequest.rb#L256-414).
WEBrick is also one of the oldest Ruby HTTP Servers, but for some reason
lacks [documentation coverage](http://www.ruby-doc.org/stdlib/libdoc/webrick/rdoc/classes/WEBrick/HTTPServer.html).
Given the rise of [Rack](http://rack.rubyforge.org/), middleware
and Rack applications, WEBricks API now seems [awkward](http://segment7.net/projects/ruby/WEBrick/servlets.html).

## The Parser

When [Parslet](http://kschiess.github.com/parslet/)
(a pure Ruby PEG Parser library) was announced, I wondered how hard would it
be to write a HTTP Parser with Parslet. After researching the other
Ragel based HTTP Parsers ([Thin](https://github.com/macournoyer/thin/blob/master/ext/thin_parser/common.rl)
and [Unicorn](https://github.com/defunkt/unicorn/blob/master/ext/unicorn_http/unicorn_http_common.rl))
and double checking [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616.html),
I suddenly had a [pure-Ruby HTTP Parser](https://github.com/postmodern/net-http-server/blob/master/lib/net/http/server/parser.rb).
(in one file, that you can actually read!)

I found that the way in which Parslet nested matches into Arrays of Hashes
resulted in data that looked very much like a Rack `env` Hash.

    require 'net/http/server/parser'
    
    parser = Net::HTTP::Server::Parser.new
    parser.parse("GET /path?x=1&y=2 HTTP/1.1\r\nCookie: xyz;123\r\n\r\n")
    # => {
    #      :method=>"GET",
    #      :uri=>{:path=>"path", :query=>"x=1&y=2"},
    #      :version=>"1.1",
    #      :headers=>[{:name=>"Cookie", :value=>"xyz;123"}]
    #    }

## The Daemon

The next step was to write an actual Daemon that would:

1. Receive Connections
2. Parse HTTP Requests
3. Pass HTTP Requests to a Request Handler
4. Receive HTTP Responses from the Request Handler
5. Send HTTP Responses
6. Close Connections

I settled on using the battle tested [GServer](http://rubydoc.info/stdlib/gserver/1.9.2/frames)
class to handle the Connections for
[Nett:HTTP::Server::Daemon](https://github.com/postmodern/net-http-server/blob/master/lib/net/http/server/daemon.rb).
I also borrowed some ideas from Rack, such as passing
HTTP Requests via a `call` method and returning HTTP Responses as an Array
(containing the HTTP Status, Headers and Body).

    require 'net/http/server'
    require 'pp'
    
    Net::HTTP::Server.run(:host => '127.0.0.1', :port => 8080) do |request,socket|
      pp request

      [200, {'Content-Type' => 'text/html'}, ['Hello World']]
    end

## The Rack Handler

Given that the API was already very Rack-ish, writing a [Rack handler](https://github.com/postmodern/net-http-server/blob/master/lib/rack/handler/http.rb) on top of `Net::HTTP::Server::Daemon` was simple.

    require 'rack/handler/http'
    require 'sinatra'

    class HelloWorld < Sinatra::Base
    
      get '/' do
        [200, {'Content-Type' => 'text/html'}, ["Hello World"]]
      end

    end

    Rack::Handler::HTTP.run HelloWorld, :Host => 'localhost', :Port => 1212

## Benchmarks

By now your probably wondering, how fast is this pure Ruby HTTP Server?

    require 'net/http/server'
    
    Net::HTTP::Server.run(:port => 8080) do |request,socket|
      [200, {'Content-Type' => 'text/html'}, ['Hello World']]
    end

    $ ab -n 4000 -c 4 http://localhost:8080/
    This is ApacheBench, Version 2.3 <$Revision: 655654 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/
    
    Benchmarking localhost (be patient)
    ...
    
    Finished 4000 requests
    
    
    Server Software:        
    Server Hostname:        localhost
    Server Port:            8080
    
    Document Path:          /
    Document Length:        11 bytes
    
    Concurrency Level:      4
    Time taken for tests:   73.405 seconds
    Complete requests:      4000
    Failed requests:        0
    Write errors:           0
    Total transferred:      220000 bytes
    HTML transferred:       44000 bytes
    Requests per second:    54.49 [#/sec] (mean)
    Time per request:       73.405 [ms] (mean)
    Time per request:       18.351 [ms] (mean, across all concurrent requests)
    Transfer rate:          2.93 [Kbytes/sec] received
    
    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0    0   0.2      0       8
    Processing:    24   73  31.5     62     236
    Waiting:       24   72  31.4     60     236
    Total:         25   73  31.5     62     236
    
    Percentage of the requests served within a certain time (ms)
      50%     62
      66%     86
      75%     98
      80%    103
      90%    119
      95%    134
      98%    148
      99%    153
     100%    236 (longest request)

Definitely not as fast as [Thin](http://code.macournoyer.com/thin/) or even
WEBrick, but not too bad considering its pure-Ruby.
