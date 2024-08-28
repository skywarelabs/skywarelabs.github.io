class EAIPComponentViewModel {
    constructor(params) {
        this.parent = params.parent;
        this.tab = params.parent.datasource().tabs[0];
        this.title = ko.observable();
        this.menu = ko.observable();
        this.parent.currentLanguage.subscribe((value) => {
            this.init(value);
        });
        this.init(this.parent.currentLanguage());
    }

    init = (value) => {
        this.title(this.tab.contents[value.code].title);
        const menu = this.tab.contents[value.code].menu.map((firstLevel) => {
            firstLevel.collapsed = false;
            return firstLevel;
        })
        this.menu(menu);
    }

}

class CollapsableMenuItemViewModel {
    constructor(params) {
        this.parent = params.parent;
        this.data = ko.observable(params.data);
    }

    collapse = () => {
        this.data().collapsed = !this.data().collapsed;
        this.data.valueHasMutated();
        this.open();
    }

    open = () => {
        const data = this.data();
        console.log(data.href);
        data.pdf = '.' + PDF_FOLDER + '/' + data.href.replace('-' + this.parent.currentLanguage().code + '.html', '.pdf');
        this.parent.setCurrentContent({
            pdf: data.pdf,
            href: './eAIP/' + data.href
        });
    }
}

class ThirdLevelMenuItemViewModel {
    constructor(params) {
        this.parent = params.parent;
        this.data = ko.observable(params.data);
    }

    open = () => {
        const data = this.data();
        console.log(data.href);
        data.pdf = '.' + PDF_FOLDER + '/' + data.href.replace('-' + this.parent.currentLanguage().code + '.html', '.pdf');
        this.parent.setCurrentContent({
            pdf: data.pdf,
            href: './eAIP/' + data.href
        });
    }
}


class AMDTComponentViewModel {
    constructor(params) {
        this.parent = params.parent;
        this.tab = params.parent.datasource().tabs[1];
        this.title = ko.observable();
        this.intro = ko.observable();
        this.menu = ko.observable();
        this.miscellaneous = ko.observable();
        this.parent.currentLanguage.subscribe((value) => {
            this.init(value);
        });
        this.init(this.parent.currentLanguage());
    }

    init = (value) => {
        this.title(this.tab.contents[value.code].title);
        this.intro(this.tab.contents[value.code].intro);
        const menu = this.tab.contents[value.code].menu.map((firstLevel) => {
            firstLevel.collapsed = true;
            firstLevel.children.map((secondLevel) => {
                if (secondLevel.children?.length) {
                    secondLevel.collapsed = true;
                }
                return secondLevel;
            })
            return firstLevel;
        })
        this.menu(menu);
        this.miscellaneous(this.tab.contents[value.code].miscellaneous);
    }

    miscFunc() {
        this.miscellaneous().collapsed = !this.miscellaneous().collapsed;
        this.miscellaneous.valueHasMutated();
    }

    collapse = (data) => {
        data.collapsed = !data.collapsed;
    }

}

class SUPComponentViewModel {
    constructor(params) {
        this.parent = params.parent;
        this.tab = params.parent.datasource().tabs[2];
        this.title = ko.observable();
        this.table = ko.observable();
        this.parent.currentLanguage.subscribe((value) => {
            this.init(value);
        });
        this.init(this.parent.currentLanguage());
    }

    init = (value) => {
        this.title(this.tab.contents[value.code].title);
        this.table(this.tab.contents[value.code].table);
    }

    open = (data) => {
        const currentLanguage = this.parent.currentLanguage().code;
        const href = data.href.split('/').join(PDF_FOLDER + '/');
        this.parent.setCurrentContent({
            pdf: './eSUP/' + href
                .replace('-' + currentLanguage + '.html', '.pdf')
                .replace(/\#.*/, ''),
            href: './eSUP/' + data.href
        });
    }

    openAffect = (data) => {
        PDF_FOLDER.replace('/', '');
        this.parent.setCurrentContent({
            pdf: '.' + PDF_FOLDER + data.href
                .replace('eAIP/', '')
                .replace('-' + this.parent.currentLanguage().code + '.html', '.pdf'),
            href: '.' + data.href
        });
    }

}

class AICComponentViewModel {
    constructor(params) {
        this.parent = params.parent;
        this.tab = params.parent.datasource().tabs[3];
        this.title = ko.observable();
        this.table = ko.observable();
        this.menu = ko.observable();
        this.parent.currentLanguage.subscribe((value) => {
            this.init(value);
        });
        this.init(this.parent.currentLanguage());
    }

    collapse = (data) => {
        data.collapsed = !data.collapsed;
    }

    init = (value) => {
        this.title(this.tab.contents[value.code].title);
        this.table(this.tab.contents[value.code].table);
        const menu = this.tab.contents[value.code].menu.map((firstLevel, index) => {
            firstLevel.collapsed = index > 0 ? true : false;
            firstLevel.children.map((secondLevel) => {
                if (secondLevel.children?.length) {
                    secondLevel.collapsed = true;
                }
                return secondLevel;
            })
            return firstLevel;
        })
        this.menu(menu);
    }

}

class AicThirdLevelMenuItemViewModel {
    constructor(params) {
        this.parent = params.parent;
        this.data = ko.observable(params.data);
    }

    open = () => {
        const data = this.data();
        const currentLanguage = this.parent.currentLanguage().code;
        const href = data.href.split('/').join(PDF_FOLDER + '/');
        this.parent.setCurrentContent({
            pdf: './eAIC/' + href
                .replace('-' + currentLanguage + '.html', '.pdf')
                .replace(/\#.*/, ''),
            href: './eAIC/' + data.href
        });
    }
}

class SearchComponentViewModel {

    constructor(params) {
        this.parent = params.parent;
        this.searchIndex = item.map((el) => {
            return {
                pdf: '.' + PDF_FOLDER + '/' + el[0].replace('-' + this.parent.currentLanguage().code + '.html', '.pdf'),
                href: '.' + el[1] + '/' + el[0],
                title: el[2],
                language: el[3],
                content: el[4],
                length: el[5],
            }
        });
        this.submit = ko.observable(false);
        this.srchval = ko.observable('');
        this.results = ko.observableArray([]);
        this.tab = params.parent.datasource().tabs[4];
        this.contents = ko.observable(this.tab.contents[params.parent.currentLanguage().code]);;

        this.parent.currentLanguage.subscribe((value) => {
            this.reset();
            this.contents(this.tab.contents[value.code]);
        });

    }

    search() {
        const lang = this.parent.currentLanguage().code;
        const q = this.srchval();
        let txt = q.split(" ");
        let fnd = new Array();
        if (typeof item !== 'undefined' && item != null) {

            for (let i = 0; i < item.length; i++) {
                if (item[i][3]?.indexOf(lang) != -1) {
                    // Verifico la lingua corrente
                    fnd[i] = 0;
                    const order = new Array(2, 4);
                    for (let j = 0; j < order.length; j++)
                        for (let k = 0; k < txt.length; k++)
                            if (item[i][order[j]]?.toLowerCase().indexOf(txt[k]?.toLowerCase()) > -1 && txt[k] != "")
                                fnd[i] += (j + 1);

                }
            }

        }
        this.submit(true);
        const results = this.searchIndex
            .map((el, index) => {
                el.score = fnd[index];
                return el;
            })
            .filter((el) => {
                return el.language === this.parent.currentLanguage().code && el.score > 0;
            })

            .sort((a, b) => {
                return b.score - a.score;
            }
            );
        this.results(results);
    }

    reset() {
        this.submit(false);
        this.srchval('');
        this.results([]);
    }

    open = (data, event) => {
        this.parent.setCurrentContent(data);
        return true;
    }

}

class EpubApplication {

    constructor(datasource) {
        this.datasource = ko.observable(datasource);
        this.tabs = ko.observableArray(datasource.tabs);
        this.currentLanguage = ko.observable(datasource.commands.languages[0]);
        this.selectedTab = ko.observable(this.tabs()[0]);
        this.currentContent = ko.observable({ href: this.currentLanguage().cover });
        this.currentLanguage.subscribe((value) => {
            const lang2 = this.datasource().commands.languages.filter((language) => {
                return language.code !== value.code;
            })[0]
            if (lang2) {
                const current = this.currentContent();
                let href = current.href.replace(lang2.code, value.code);
                this.currentContent({ href });
            }
        });
        Split(['.a', '.b'], {
            gutterSize: 3,
            sizes: ['300px', '100%'],
            minSize: ['300px', '100%']
        });

        Split(['.commands', '.menu'], {
            gutterSize: 2,
            sizes: ['150px', '100%'],
            direction: 'vertical',
            maxSize: ['150px', '100%'],
        });


    }

    setActiveTab = (tab) => {
        this.selectedTab(tab);
    };

    setCurrentLanguage = (language) => {
        console.log(language);
        this.currentLanguage(language);
    };

    setCurrentContent = (content) => {
        this.currentContent(content);
    }

    openPdf = () => {
        const current = this.currentContent();
        if (current.href.indexOf("Cover") != -1) {
            current.pdf = '.' + PDF_FOLDER + coverPagePDFFile;
        }
        console.log(current);
        this.currentContent({ href: current.pdf ?? current.href });
    }

    openHelp = () => {
        this.setCurrentContent({
            href: this.currentLanguage().help
        });
    }

    openCover = () => {
        this.setCurrentContent({
            href: this.currentLanguage().cover
        });
    }

}

ko.components.register('eaip-tab', {
    viewModel: EAIPComponentViewModel,
    template: { element: 'eaip-template' }
});
ko.components.register('amdt-tab', {
    viewModel: AMDTComponentViewModel,
    template: { element: 'amdt-template' }
});
ko.components.register('sup-tab', {
    viewModel: SUPComponentViewModel,
    template: { element: 'sup-template' }
});
ko.components.register('aic-tab', {
    viewModel: AICComponentViewModel,
    template: { element: 'aic-template' }
});
ko.components.register('search-tab', {
    viewModel: SearchComponentViewModel,
    template: { element: 'search-template' }
});

ko.components.register('first-level-menu-item', {
    viewModel: CollapsableMenuItemViewModel,
    template: { element: 'first-level-menu-item' }
});

ko.components.register('amdt-first-level-menu-item', {
    viewModel: CollapsableMenuItemViewModel,
    template: { element: 'amdt-first-level-menu-item' }
});

ko.components.register('aic-first-level-menu-item', {
    viewModel: CollapsableMenuItemViewModel,
    template: { element: 'aic-first-level-menu-item' }
});

ko.components.register('second-level-menu-item', {
    viewModel: CollapsableMenuItemViewModel,
    template: { element: 'second-level-menu-item' }
});

ko.components.register('amdt-second-level-menu-item', {
    viewModel: CollapsableMenuItemViewModel,
    template: { element: 'amdt-second-level-menu-item' }
});

ko.components.register('third-level-menu-item', {
    viewModel: ThirdLevelMenuItemViewModel,
    template: { element: 'third-level-menu-item' }
});

ko.components.register('amdt-last-level-menu-item', {
    viewModel: ThirdLevelMenuItemViewModel,
    template: { element: 'amdt-last-level-menu-item' }
});

ko.components.register('aic-last-level-menu-item', {
    viewModel: AicThirdLevelMenuItemViewModel,
    template: { element: 'aic-last-level-menu-item' }
});
ko.applyBindings(new EpubApplication(DATASOURCE));