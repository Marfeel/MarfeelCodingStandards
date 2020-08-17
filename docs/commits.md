---
title: Commits
tag: docs
---

# Commits at Marfeel

Marfeel developers share the same git workflow and standards, no matter which project they work on.

## Branching & PR

All branches should be named after the JIRA epic or ticket name: this way they can reference each other.

Developers should reguarly rebase or merge with the base branch to prevent major conflicts.

All commits must be squashed in one before merging a pull request: 1 pull request = 1 commit.
When squashing, the body with the list of commits should be deleted.

## Semantic commits

Inspired by [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines), Marfeel team uses Commitzen to help standardise all commit messages and make collaboration easier.
Feel free to use the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen).

Commit Format:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The header is mandatory and the scope of the header is optional.

Any line of the commit message cannot be longer 100 characters!
This allows the message to be easier to read on GitHub as well as in various git tools.

### Types

Types are the same across all Marfeel projects.
Must be one of the following:

* `build`: Changes that affect the build system or external dependencies
* `ci`: Changes to our CI configuration files and scripts
* `docs`: Documentation only changes
* `feat`: A new feature
* `fix`: A bug fix
* `perf`: A code change that improves performance
* `refactor`: A code change that neither fixes a bug nor adds a feature
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* `test`: Adding missing tests or correcting existing tests
* `Update`: a maintenance change that is not related to Marfeel (stop a direct campaign, update a css mapping...)

### Scope

The scope of the commit depends on each project.
For Media Group commits, it should be one of:

* `extraction`
* `ads`
* `widgets`
* `metrics`
* `pwa`
* `UI`
* `metadata`
* `cherokee`
* `comments`
* `searchConsole`
* `paywall`
* `gallery`

And all scopes can be prefixed with `amp-`.

For LeroyMarfeel, it is in [their Contributing page](https://github.com/Marfeel/LeroyMarfeel/blob/master/CONTRIBUTING.md).

### Subject

The subject contains a succinct description of the change:

* Use the imperative, present tense: "change" not "changed" nor "changes"
* Don't capitalize the first letter
* No dot (.) at the end
* Try to specify why the change was made (only if it can be exaplained in a short way)

### Body

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

Use it to justify the change or explain what affects.

### Footer

The footer should contain any information about Breaking Changes.

Breaking Changes should start with the word BREAKING CHANGE: with a space or two newlines. The rest of the commit message is then used for this.

::: tip
Github pull request squash should follow the same specification.
:::

### Examples

* feat(extraction): Add cocina section
* fix(metrics): add missing UGA param
* refactor(extraction): use jsoup instead of whitecollar for performance
* feat(metrics): add comscore
* fix(layout): remove title from featured content group
* feat(cherokee): update store id
