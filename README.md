##"Fork me on GitHub" Ribbon Builder

Pure CSS "For me on GitHub" ribbon generator

##How to

The builder is located at [catdad.github.io/fork-ribbon-css-builder](http://catdad.github.io/fork-ribbon-css-builder). Once there, you can preview the ribbon, change some attributes, and copy the code.

##Note

This project is in no way endorced or sponsored by GitHub. I just wanted pure CSS ribbons that do not load an image. If you want the official ribbons, you can get them here: https://github.com/blog/273-github-ribbons

This ribbon is meant to be simplified version of GitHub's ribbons, and is not a picture perfect copy in CSS. If that is what you are looking for, try these: https://github.com/simonwhitaker/github-fork-ribbon-css

This ribbon is supported in modern browsers. If you want support in Internet Explorer, look elsewhere.

The position of this ribbon is set to `fixed`, rather than the original `absolute` of other ribbons. This is because the ribbon goes off the page and causes horizontal scrolling in the `absolute` configuration, as it does in most other CSS ribbons you'll find on GitHub. As a result of this, the ribbon will always stay in its position while scrolling the page. If this is bad for you, look elsewhere.

If you want to see how all the magic happens, and configure it by hand, check out the `sample.css` file.

##License

The ribbon code is yours to use however you would like. The source itself is licensed under the MIT X11 License. Please use, adapt, and modify this project to your heart's content. Link back to this page wherever you can.
