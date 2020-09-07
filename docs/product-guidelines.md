---
title: Product guidelines
tags: docs
---

# Product guidelines

Things that we can do in a Mediagroup repository

Ideally with [Marfeel's extensibilty](./../extensibility/README.md), if everything were supported out-of-the-box by `MarfeelXP`, a MediaGroup repository would contain only
1. JSON files: definition.json, inventory.json, metrics.json, ui.json, layoutDescriptor.json, ...
2. Extraction parameters for whiteCollar, Boilerproviders, Metadataproviders

But, since we do not support everything, `MarfeelXP` offers, as extension points, the following:
1. Custom JSPs (layouts) or overwrite `MarfeelXP` JSP files
2. Create custom Javascript for adservers, metrics, and widgets
3. Create custom Javascript in `custom.js` allowing any Javascript execution code, with full access to core classes, and browser
4. Create custom styles via `.SASS` files

## Benefits of the current architecture

1. Makes `MarfeelXP` very flexible, open to any implementation or feature that a client requests
2. Autonomy for Solutions and GOL teams

## Drawbacks of the current architecture (with great power, comes great responsibility...)

1. Almost any part of `MarfeelXP` can be overwritten. This means a loss of control from core teams.
2. Changes in `MarfeelXP` are very difficult, or impossible, since core developers cannot predict if custom MediaGroup code is going to break.
3. Re-inventing the wheel every time: a custom implementation is completely isolated, and hard to re-use by other media groups, if someone doesn't remember that something has been implemented before.
4. Prone to "hack-driven-development".
5. Not a clear path to implement something new.
6. `MarfeelXP` cannot ensure Marfeel KPI's in terms of monetization, speed, ...

## Guidelines

### Abstract methods

To extend properly any part of Marfeel it's mandatory to only use the methods defined in every `Abstract` class.

For example:

For custom metrics implementations, the only methods available are the methods from [`AbstractTracker`](https://github.com/Marfeel/MarfeelXP/blob/master/Dixie/src/js/marfeel/touch/features/metrics/AbstractTracker.js) class:
 * `buildFromJSON`
 * `trackVirtualPage`

Direct extensions from `Metrics.js` aren't allowed:

```js
Metrics.GA.eventsQueue = [];
Metrics.addAnalytics()
```

Check the following articles to create custom extensions:

- [Analytics provider](./../metrics/guides/create-an-analytics-provider.md)
- [Custom commenting systems extensions](./../comments/how-to-create.md)
- [Ad server provider](./../advertisement/guides/how-to-create-an-ad-server-provider.md)
- [Widget provider](./../widgets/widget-providers.md)

Extensions through abstract methods examples:

* [Permutive.js tracker](https://github.com/Marfeel/DennisPublishingPro/blob/master/www.denofgeek.com/common/js/features/metrics/Permutive.js)
* [Custom comments](https://github.com/Marfeel/WilderCampos/blob/master/www.internetgratisandroid.com/index/src/js/features/comments/CustomEmbedComments.js)
* [Extending the Adserver class](https://github.com/Marfeel/DIXI-MEDIA-DIGITAL--SL/blob/master/www.lainformacion.com/index/src/js/features/adservers/KruxDFP.js)

### Overriding methods

If you need to change the value of a field or a class in Core you should use accessors rather than directly modified them. This encapsulation is created to avoid changes that could break Marfeel Platform.

Example of wrong modifications, which make Core difficult to maintain:

- [Core classes modification `MediaUtils`](https://github.com/Marfeel/Titania/commit/e76f6ff93bc1a3471ab93d422a24a00315e41506).

If a similar modification is required for a functionality, this is an indicator that a more sustainable solution must be found in core.
Check [hacking the solution](#hacking-the-solution).

### Duplicating extensions

If the extension for a specific provider already exists in Marfeel, but a new feature or modification to this extension is needed, it's important to analyze **why this feature is not supported by default in Marfeel**.

The first approach shouldn't be to copy the existing code in the tenant code repository to add only this new feature or change.
This approach could generate consequences that the original implementation was trying to avoid.

If after the analysis the result is that the new feature should be included, then it needs to be implemented in Marfeel Core not only in the Tenant's code repository. This applies to:

- [Analytics provider](./../metrics/guides/create-an-analytics-provider.md)
- [Commenting systems extensions](./../comments/how-to-create.md)
- [Ad server provider](./../advertisement/guides/how-to-create-an-ad-server-provider.md)
- [Widget provider](./../widgets/widget-providers.md)

Examples where we have modified the original core extension to support new functionality:

* [PanMetrics vs. CXense](https://github.com/Marfeel/MarfeelXP/pull/12040/files)

### Custom metric extension

When a custom metric extension is created the only valid types in the `metrics.json` file are:

* `js` for **Touch**,
* `json` and `pixel` for **AMP**.

Example of wrong implementation:

```json
"custom": [
    {
        "type": "jsp",
        "platforms": [
            "AMP"
        ],
        "srcPath": "custom/metrics.jsp"
    }
]
```

This implementation is not compatible with **AMP** and can create a lot of conflicts.
This implementation usually relies on using an `amp-iframe` of size 1x1:
[AMP allows only one of those per page, which Marfeel already uses for its own purpose](https://amp.dev/documentation/components/amp-iframe/#tracking/analytics-iframes).

Check [this article](./../metrics/guides/create-an-analytics-provider.md) to know how to properly extend Metric systems.

Examples:

* [Custom `js` metrics for Touch](https://github.com/Marfeel/All4womenCoZa/blob/master/www.all4women.co.za/index/resources/metrics.json#L33)
* [Custom `json` metrics for AMP](https://github.com/Marfeel/eg-ru/blob/master/www.eg.ru/index/resources/metrics.json#L53)
* [Custom `pixel` metrics for AMP](https://github.com/Marfeel/BuzzDigitalPublishing/blob/master/maduradas.com/index/resources/metrics.json#L17)

### WhiteCollar files size

It's important to maintain in the [`whiteCollar` files](./../content-platform/sdk-reference/whitecollar.md) only the logic for extraction and leave setup of the layouts and positions of the articles in the [`layoutDescriptor` files](./../render-platform/sdk-reference/layoutdescriptor-json.md).

The lines of code of the `whiteCollar` files are an important indicator when something is wrong in the implementation. If the extraction it's getting to complicated and it passes the 100 lines of code for Small or medium Tenants or 200 for Large or Extra-Large Tenants it's an indicator that a different approach to implementing this extraction is necessary.

Also, the use of custom Javascript code should be minimum, instead of the methods from the [WC library](./../content-platform/sdk-reference/wc-library.md) should be used.

This type of [`whiteCollar` implementation](https://github.com/Marfeel/Grupo-La-Rep-blica-Publicaciones-S-A-/blob/master/larepublica.pe/index/src/whiteCollar/home.js) should be avoided.

Examples of whiteCollar and Layout descriptors working together:

* www.elfarandi.com: [home layout descriptor](https://github.com/Marfeel/Rory-Branker-20191103023009/blob/master/www.elfarandi.com/themes/mediaBlog/layoutsDescriptor/home.s.json) and [home whitecollar](https://github.com/Marfeel/Rory-Branker-20191103023009/blob/master/www.elfarandi.com/index/src/whiteCollar/home.js)
* www.diariodemorelos.com: [home layout descriptor](https://github.com/Marfeel/diariodemorelos-com/blob/master/www.diariodemorelos.com/themes/mediaBlog/layoutsDescriptor/home.s.json) and [home whitecollar](https://github.com/Marfeel/diariodemorelos-com/blob/master/www.diariodemorelos.com/index/src/whiteCollar/home.js)

### SCSS files size

As with the `whiteCollar`, the use of big custom SCSS files is a clear indicator that there is a problem in the implementation.

The use of Core CSS should be avoided and the existing Mixins should be the first approach to customized styles in the Tenant's site. Check existing Mixins per every MarfeelUI Component:

* [Global Components](./../render-platform/components-global.md)
* [Sections pages Components](./../render-platform/components-sections-pages.md)
* [Article pages Components](./../render-platform/components-article-pages.md)

If you're adding custom styles to a class, prefer creating a new class with [CSS Mappings](../render-platform/components-article-pages.md#css-mappings) rather than using the core `mrf-...` classes.

Implementations as big and custom as [this](https://github.com/Marfeel/AdAge.com/blob/master/adage.com/index/src/scss/_custom.scss), should be avoided.

### CSS in Javascript files

The CSS styles should never be within a Javascript file. In cases where this is needed, [Webpack SCSS loader](https://webpack.js.org/concepts/loaders/#inline) can be used to dump the CSS content into a variable and then use it.

Example usage of the loader:

* [In an `ads.js` file](https://github.com/Marfeel/thesocialpost.it/blob/master/www.thesocialpost.it/index/src/js/ads.js)

### JSP overwritten

All MarfeelUI Components can be [shadowed](./../render-platform/shadowing.md) to be customized but by doing it you **lose backward compatibility**. Because of this, Marfeel has [recommended templates for shadowing](./../render-platform/shadowing.md#recommended-templates-for-shadowing), that are JSPs files completely prepare to be overwritten.

Example JSPs that should not be overwritten:

* Custom AMP push notifications
* [Mosaic header bar](https://github.com/Marfeel/AlBawabaMiddleEastLimited/blob/master/www.albawaba.com/themes/amp/controlBars/mosaicHeaderBar.s.jsp)

### Hacking the solution

If you find that extending Marfeel Platform doesn't solve the problem and you need to hack the solution, this is an indicator that you need to raise the hand and escalate the issue.

The goal with a proper escalation is to improve the product and find features that make Marfeel Platform more extensible and easy to use. Also, avoid issues coming from these edge cases.
