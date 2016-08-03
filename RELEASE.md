## Releasing jquery-ujs

### Releasing to npm

Make sure npm's configuration `sign-git-tag` is set to true.

```
npm config set sign-git-tag true
```

Release it to npm using the [npm version command](https://docs.npmjs.com/cli/version). Like:

```
npm version patch
```

This will:

* Bump a patch version
* Commit the change
* Generate the tag
* Push the commit and the tag to the repository
* Publish the package in https://www.npmjs.com
