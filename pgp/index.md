---
layout: page
title: /pgp
---

# PGP

My PGP key [0xB9515E77] can be securely downloaded from [GitHub](https://raw.github.com/postmodern/postmodern.github.io/main/postmodern.asc):

    $ wget https://raw.github.com/postmodern/postmodern.github.io/main/postmodern.asc
    $ gpg --import postmodern.asc
    gpg: key B9515E77: public key "Postmodern Modulus III (Postmodern) <postmodern.mod3@gmail.com>" imported
    gpg: Total number processed: 1
    gpg:               imported: 1

In order to verify that you have imported the correct key, run the following
command:

    $ gpg --fingerprint 0xB9515E77
    pub   1024D/B9515E77 2009-09-18
          Key fingerprint = 04B2 F3EA 6541 40BC C7DA  1B57 54C3 D9E9 B951 5E77
    uid                  Postmodern Modulus III (Postmodern) <postmodern.mod3@gmail.com>
    sub   4096g/4BD91DF0 2009-09-18
    
Make sure to verify that the "Key fingerprint" matches.

[0xB9515E77]: http://pgp.mit.edu:11371/pks/lookup?op=get&search=0xB9515E77
