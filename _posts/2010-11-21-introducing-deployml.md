---
layout: post
title: Introducing DeploYML
tags:
 - ruby
 - rails
 - bundler
 - deploy
---

When Rails 3.0.0.beta.1 was first released, there was some confusion about
how to deploy a Rails3 app with this new [Bundler](http://gembundler.com)
thing. A few blog posts were written with some monkey patches for injecting
into [Capistrano](https://github.com/capistrano/capistrano/wiki/Documentation-v2.x),
which enable early Bundler support. Unfortunately, Bundler was still very
new and none of the deployment tools had official support yet.

Around the same time, I needed to deploy a Rails3 app and I did not want to
deal with the heavy weight of Capistrano; nor did I want to rely on a
monkey patch from a blog post. Of course the first thing I did was
look at the alternatives, which were
[Vlad The Deployer](http://rubyhitsquad.com/Vlad_the_Deployer.html) or
write a bash script that used `rsync` / `ssh` / `git`. After trying to run
the `vlad` rake tasks, I hit some weird bugs with how it was calling
`git` or `thin`. Being on a dead-line and not wanting to wait on
Capistrano or Vlad, I thought it should be easy to create a simple
deployment utility with `git` and `ssh`.

## DeploYML

Introducing [DeploYML](http://github.com/postmodern/deployml#readme),
a simple deployment solution for Ruby / Rails projects that uses a
**single YAML file**, [Git](http://http://www.git-scm.com) and `ssh`.

Configuring DeploYML requires at least **two** things:

    # config/deploy.yml
    source: git@github.com:user/project.git
    dest: deploy@www.example.com/var/www/site

Then one can deploy the project using the `deployml` command:

    $ deployml deploy

After making some changes, one can re-deploy the project:

    $ deployml redeploy

## Configuration

Of course, one will want to specify more information, such as what server
to run the project under:

    source: git@github.com:user/project.git
    dest: deploy@www.example.com/var/www/site
    server: apache

Or what options to run the server with:

    source: git@github.com:user/project.git
    dest: deploy@www.example.com/var/www/site
    server:
      name: thin
      options:
        servers: 4
        deamonize: true
        socket: /var/run/thin.sock
        rackup: true

Or more importantly, what Framework or ORM the project uses:

    source: git@github.com:user/project.git
    dest: deploy@www.example.com/var/www/site
    framework: rails3
    orm: datamapper
    server: apache

One can even specify multiple-environments:

    # config/deploy.yml
    source: git@github.com:user/project.git
    framework: rails3
    orm: datamapper

    # config/deploy/staging.yml
    dest: ssh://deploy@www.example.com/srv/staging
    server:
      name: thin
      options:
        config: /etc/thin/staging.yml
        socket: /tmp/thin.staging.sock

    # config/deploy/production.yml
    dest: ssh://deploy@www.example.com/srv/project
    server:
      name: thin
      options:
        config: /etc/thin/example.yml
        socket: /tmp/thin.example.sock

## Administration

DeploYML does more than just deploying, it also allows interacting with the
deployment server and deployed project.

Need to quickly `ssh` into the server as the deploy user?

    $ deployml ssh

Need to quickly execute a command remotely, within the directory of the
deployed project?

    $ deployml exec 'ps aux'

Need to execute a rake task remotely?

    $ deployml rake db:autoupgrade

## Interested?

Install it today:

    $ gem install deployml

**Note:** I originally started [DeploYML](https://github.com/postmodern/deployml/commits/f287b187f585eb03c0eb2a13b4149501b43d7b4d)
before [Imploy](http://ruby5.envylabs.com/episodes/96-episode-94-july-16-2010/stories/812-rails3-deployments-with-inploy)
was released, and just now got around to making a release. If you feel
Capistrano is too heavy, I encourage you to also checkout
[Imploy](https://github.com/dcrec1/inploy) for deploying Rails3 apps.
