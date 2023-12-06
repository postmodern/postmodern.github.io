---
layout: post
title: Solving Advent of Cyber 2023 Day 2 using Ruby
author: postmodern
tags:
  - tryhackme
  - ctf
  - adventofcyber
  - adventofcyber2023
  - ruby
---

This year I decided to try my hand at the [Advent of Cyber] challenges.

The Day 2 challenge involves Data Science. We are given a [Jupyter Notebook]
file containing a table of log data showing ports scan events. Now the challenge
teaches you how to use [Jupyter Notebook] and Python, but we're not going to
solve it using Python. We are going to solve it using only Ruby!

While Python is very popular in the Data Science field, you can do Data Science
with Ruby. Ruby standard library comes with many useful methods, such as
[map][Enumerable#map], [select][Enumerable#select],
[group_by][Enumerable#group_by], [group_by][Enumerable#max_by], which allow you
to slice and dice large datasets.

First, we will need to liberate the data from the Jupyter Notebook. To do this,
we open the Jupyter Notebook, navigate to the Table View, select all rows,
copy the rows, and paste into a text file.

```
PacketNumber	Timestamp	Source	Destination	Protocol
1	05:49.5	10.10.1.7	10.10.1.9	HTTP
2	05:50.3	10.10.1.10	10.10.1.3	TCP
3	06:10.3	10.10.1.1	10.10.1.2	HTTP
4	06:10.4	10.10.1.9	10.10.1.3	ICMP
...
```

The rows will paste as Tab Separated Values (TSV). We will need to convert the
rows into Comma Separated Values (CSV). Converting from TSV to CSV is as simple 
as the following `vim` substitution command `%s/\v\t/,/g`.

```csv
PacketNumber,Timestamp,Source,Destination,Protocol
1,05:49.5,10.10.1.7,10.10.1.9,HTTP
2,05:50.3,10.10.1.10,10.10.1.3,TCP
3,06:10.3,10.10.1.1,10.10.1.2,HTTP
4,06:10.4,10.10.1.9,10.10.1.3,ICMP
...
```

Much better. Finally, we save the file to `data.csv`.

Next, we will spawn an Interactive Ruby session using `irb` with the `csv`
library preloaded:

```shell
$ irb -r csv
irb(main):001> 
```

Now we will load our `data.csv` file into a variable:

```ruby
csv = CSV.read('data.csv', headers: true)
```

Now we just have to answer the Day 2 questions using pure Ruby.

> How many packets were captured (looking at the PacketNumber)?

```ruby
csv[-1]['PacketNumber']
```

> What IP address sent the most amount of traffic during the packet capture?

```ruby
csv.group_by { |row| row['Source'] }.max_by { |ip,events| events.count }.first
```

> What was the most frequent protocol?

```ruby
csv.group_by { |row| row['Source'] }.max_by { |ip,events| events.count }.first
```

As you can see, you don't necessarily have to use Python for Data Science.
Ruby is more than capable of doing basic Data Science.

[Advent of Cyber]: https://tryhackme.com/room/adventofcyber2023
[Jupyter Notebook]: https://jupyter.org/
[Enumerable#map]: https://rubydoc.info/stdlib/core/Enumerable#map-instance_method
[Enumerable#select]: https://rubydoc.info/stdlib/core/Enumerable#select-instance_method
[Enumerable#group_by]: https://rubydoc.info/stdlib/core/Enumerable#group_by-instance_method
[Enumerable#max_by]: https://rubydoc.info/stdlib/core/Enumerable#max_by-instance_method
