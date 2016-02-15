Contributing to jquery-ujs
=====================

[![Build Status](https://travis-ci.org/rails/jquery-ujs.svg?branch=master)](https://travis-ci.org/rails/jquery-ujs)

jquery-ujs is work of [many contributors](https://github.com/rails/jquery-ujs/graphs/contributors). You're encouraged to submit [pull requests](https://github.com/rails/jquery-ujs/pulls), [propose features and discuss issues](https://github.com/rails/jquery-ujs/issues).

#### Fork the Project

Fork the [project on Github](https://github.com/rails/jquery-ujs) and check out your copy.

```
git clone https://github.com/contributor/jquery-ujs.git
cd jquery-ujs
git remote add upstream https://github.com/rails/jquery-ujs.git
```

#### Create a Topic Branch

Make sure your fork is up-to-date and create a topic branch for your feature or bug fix.

```
git checkout master
git pull upstream master
git checkout -b my-feature-branch
```

#### Bundle Install and Test

Ensure that you can build the project and run tests. Run `rake test:server` first, and then run the web tests by visiting [[http://localhost:4567]] in your browser. Click the version links at the top right of the page to run the test suite with the different supported versions of jQuery.

```
bundle install
rake test:server
```

#### Write Tests

Try to write a test that reproduces the problem you're trying to fix or describes a feature that you want to build. Add to [test](test).

Here are some additional notes to keep in mind when developing your patch for jquery-ujs.

* The tests can be found in:
```
    |~test
      |~public
        |~test
```
* Some tests ensure consistent behavior across the major browsers, meaning it is possible for tests to pass in Firefox, but fail in Internet Explorer. If possible, it helps if you can run the test suite in multiple browsers before submitting patches.

We definitely appreciate pull requests that highlight or reproduce a problem, even without a fix.

#### Write Code

Implement your feature or bug fix.

Make sure that `bundle exec rake test` completes without errors.

#### Write Documentation

Document any external behavior in the [README](README.md).

#### Commit Changes

Make sure git knows your name and email address:

```
git config --global user.name "Your Name"
git config --global user.email "contributor@example.com"
```

Writing good commit logs is important. A commit log should describe what changed and why.

```
git add ...
git commit
```

#### Push

```
git push origin my-feature-branch
```

#### Make a Pull Request

Go to https://github.com/contributor/jquery-ujs and select your feature branch. Click the 'Pull Request' button and fill out the form. Pull requests are usually reviewed within a few days.

#### Rebase

If you've been working on a change for a while, rebase with upstream/master.

```
git fetch upstream
git rebase upstream/master
git push origin my-feature-branch -f
```

#### Check on Your Pull Request

Go back to your pull request after a few minutes and see whether it passed muster with Travis-CI. Everything should look green, otherwise fix issues and amend your commit as described above.

#### Be Patient

It's likely that your change will not be merged and that the nitpicky maintainers will ask you to do more, or fix seemingly benign problems. Hang on there!

#### Thank You

Please do know that we really appreciate and value your time and work. We love you, really.
