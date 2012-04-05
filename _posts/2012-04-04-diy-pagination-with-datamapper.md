---
layout: default
title: DIY Pagination with DataMapper
tags:
 - ruby
 - datamapper
 - sinatra
---

There are many pagination solutions out there. Of course there's the venerable
[will_pagination][1] and the much newer [Kaminari][2]. However, all of the
pagination solutions usually contain boiler-plate HTML. What if we only
want the pagination logic, maybe in a JSON API, without using Rails or
ActiveRecord, but instead [Sinatra][3] and [DataMapper][4]. As it turns out,
DataMapper makes DIY pagination as simple as:

    @posts = Post[((page - 1) * per_page), per_page]

As a Sinatra helper method this would look like:

    def paginate(query)
      @page     = (params[:page] || 1).to_i
      @per_page = (params[:per_page] || 10).to_i
    
      query[((@page - 1) * @per_page), @per_page]
    end

Now, what if we want to know the total number of pages and records? Enter the
[dm-chunked_query][5] gem, which provides convenience methods for querying
chunks of records:

    require 'dm-chunked_query'
    
    def paginate(query)
      @page        = (params[:page] || 1).to_i
      @per_page    = (params[:per_page] || 10).to_i

      @pages       = query.chunks_of(per_page)
      @total_count = @pages.count
      @page_count  = @pages.length

      @pages[@page - 1]
    end

Pagination is that simple.

[1]: https://github.com/mislav/will_paginate#readme
[2]: https://github.com/amatsuda/kaminari#readme
[3]: http://sinatrarb.com/
[4]: http://datamapper.org/
[5]: https://github.com/postmodern/dm-chunked_query#readme
