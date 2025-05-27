---
layout: post
title: How to use ActiveRecord in a library
tags:
  - ruby
  - activerecord
  - library
---

Recently, I wanted to use [ActiveRecord] in a library, _not_ in a Rails app or
a Rails engine. After doing a bit of Googling, I found this excellent
[tutorial][1]. While it covered the basics, such as connecting to the database,
defining a model and a migration, it missed a few things. In this blog post I
will provide a more detailed example of how to connect to a default or
arbitrary database, "connect" multiple models to the database, and run a
directory of migrations if they have not already been ran.

## Connecting to the Database

```ruby
require 'active_record'

ActiveRecord::Base.establish_connection(
  adapter:  'sqlite3',
  database: 'database.sqlite3'
)
```

If you want to connect to a separate database for tests, you can use an
in-memory sqlite3 database:

```ruby
ActiveRecord::Base.establish_connection(
  adapter:  'sqlite3',
  database: ':memory:'
)
```

## Migrations

```ruby
# lib/library/migrations/0001_create_authors_table.rb
class CreateAuthorsTable < ActiveRecord::Migration[7.0]

  def change
    create_table :library_authors do |t|
      t.string :name, null: false
      t.index :name, unique: true
    end
  end

end
```

```ruby
# lib/library/migrations/0002_create_books_table.rb
class CreateBooksTable < ActiveRecord::Migration[7.0]

  def change
    create_table :library_books do |t|
      t.string :title
      t.index :title, unique: true
    end
  end

end
```

```ruby
# lib/library/migrations/0003_create_book_authors_table.rb
class CreateBookAuthorsTable < ActiveRecord::Migration[7.0]

  def change
    create_table :library_book_authors do |t|
      t.references :author, null: false,
                            foreign_key: {
                              to_table: :library_authors
                            }
      t.references :book, null: false,
                          foreign_key: {
                            to_table: :library_books
                          }
      t.index [:author_id, :book_id], unique: true
    end
  end

end
```

**Note:** due to how `ActiveRecord` loads migration classes they must _not_ be
defined in a module namespace and must _not_ contain any all-uppercase acronym
words (ex: `CreateIpAddressesTable` not `CreateIPAddressesTable`).

## Running Migrations

ActiveRecord provides a [ActiveRecord::MigrationContext] class
which can load and run migrations similar to `rake db:migrate`. This class can
be initialized with our own `migrations/` directory path, which will load all
migrations within the directory and allow us to run the migrations.

[ActiveRecord::MigrationContext]: https://rubydoc.info/gems/activerecord/ActiveRecord/MigrationContext

The next step is to define our own `Migrations` module which defines
`migrate`, `migrate_up`, and `migrate_down` methods which call the
`.migrate`, `.up`, and `.down` methods on the initialized
`ActiveRecord::MigrationContext` object:

```ruby
# lib/library/migrations.rb
require_relative 'active_record'

module Library
  module Migrations
    DIR = File.join(__dir__,'migrations')

    def self.context
      @context ||= ActiveRecord::MigrationContext.new([DIR])
    end

    def self.migrate(target_version=nil)
      context.migrate(target_version)
    end

    def self.migrate_up(target_version=nil)
      context.up(target_version)
    end

    def self.migrate_down(target_version=nil)
      context.down(target_version)
    end
  end
end
```

## Models

```ruby
# lib/library/author.rb
module Library
  class Author < ActiveRecord::Base

    self.table_name_prefix = 'library_'

    attribute :name, :string
    validates :name, presence: true,
                     uniqueness: true

    has_many :authorships, class_name: 'BookAuthor'
    has_many :books, through:    :authorships,
                     inverse_of: :authors

  end
end
```

**Note:** the explicit `self.table_name_prefix` is required since ActiveRecord
is unable to infer the table prefix based on the module namespace.

```ruby
# lib/library/book_author.rb
module Library
  class BookAuthor < ActiveRecord::Base

    self.table_name_prefix = 'library_'

    belongs_to :book, required: true

    belongs_to :author, required: true

  end
end
```

**Note:** while the Internet says that all `belongs_to` associations are
required by default since Rails 5, when using ActiveRecord _outside_ of Rails
one must explicitly add `required: true` to them.

```ruby
# lib/library/book.rb
module Library
  class Book < ActiveRecord::Base

    self.table_name_prefix = 'library_'

    attribute :title, :string
    validates :title, presence: true,
                      uniqueness: true

    has_many :book_authors
    has_many :authors, through:    :book_authors,
                       inverse_of: :books

  end
end
```

To make it easy to load all models after establishing the database connection
(ActiveRecord does not allow you to define any model classes before calling
`ActiveRecord::Base.establish_connection`), we also create a
`models.rb` file:

```ruby
# lib/library/models.rb
require_relative 'author'
require_relative 'book'
require_relative 'book_author'

module Library
  MODELS = [
    Author,
    Book,
    BookAuthor
  ]
end
```

### ActiveRecord::Base.connection

In order for your model's `inspect` methods to work properly, the ActiveRecord
models need to be "connected" to the established database connection. This can
be done by calling `connection` on each model class.

```ruby
Library::Book.inspect
# => "Library::Book (call 'Library::Book.connection' to establish a connection)"

Library::Book.connection

Library::Book.inspect
# => "Library::Book(id: integer, title: string)"
```

**Note:** for some reason it appears that this extra step is not necessary if
the migrations are ran before loading the models.

I am not really sure why this extra step is necessary, as it seems like
ActiveRecord could lazy-connect each model when `ActiveRecord::Base#inspect` is
called.

## Putting It All Together

Now we just need an entry-point method that can:

1. Connect to the database
2. Run migrations (if there are any pending migrations)
3. "connect" the models

We shall call this entry-point method `Library.connect`:

```ruby
# lib/library.rb
module Library
  DEFAULT_DATABASE = {
    adapter:  'sqlite3',
    database: '/path/to/default/database.sqlite3'
  }

  def self.connect(database=DEFAULT_DATABASE)
    ActiveRecord::Base.establish_connection(database)

    require_relative 'library/migrations'
    Migrations.migrate_up

    require_relative 'library/models'
    MODELS.each(&:connection)
  end
end
```

If you are interested, I have pushed the working code for this blog post to
[GitHub](https://github.com/postmodern/example-activerecord-lib#readme).

[ActiveRecord]: https://guides.rubyonrails.org/active_record_basics.html

[1]: https://www.devdungeon.com/content/ruby-activerecord-without-rails-tutorial
