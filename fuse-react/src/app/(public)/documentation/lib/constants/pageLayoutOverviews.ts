import CardedFullWidthNormalScrollComponent from '../../components/views/user-interface/page-layouts/carded/CardedFullWidthNormalScrollComponent';
import CardedFullWidthPageScrollComponent from '../../components/views/user-interface/page-layouts/carded/CardedFullWidthPageScrollComponent';
import CardedFullWidthContentScrollComponent from '../../components/views/user-interface/page-layouts/carded/CardedFullWidthContentScrollComponent';
import CardedWithSidebarsNormalScrollComponent from '../../components/views/user-interface/page-layouts/carded/CardedWithSidebarsNormalScrollComponent';
import CardedWithSidebarsPageScrollComponent from '../../components/views/user-interface/page-layouts/carded/CardedWithSidebarsPageScrollComponent';
import CardedWithSidebarsContentScrollComponent from '../../components/views/user-interface/page-layouts/carded/CardedWithSidebarsContentScrollComponent';
import SimpleFullWidthNormalScrollComponent from '../../components/views/user-interface/page-layouts/simple/SimpleFullWidthNormalScrollComponent';
import SimpleFullWidthPageScrollComponent from '../../components/views/user-interface/page-layouts/simple/SimpleFullWidthPageScrollComponent';
import SimpleFullWidthContentScrollComponent from '../../components/views/user-interface/page-layouts/simple/SimpleFullWidthContentScrollComponent';
import SimpleWithSidebarsNormalScrollComponent from '../../components/views/user-interface/page-layouts/simple/SimpleWithSidebarsNormalScrollComponent';
import SimpleWithSidebarsPageScrollComponent from '../../components/views/user-interface/page-layouts/simple/SimpleWithSidebarsPageScrollComponent';
import SimpleWithSidebarsContentScrollComponent from '../../components/views/user-interface/page-layouts/simple/SimpleWithSidebarsContentScrollComponent';

const pageLayoutOverviews = {
	carded: {
		fullWidth: {
			title: 'Carded Full Width Page Layout',
			description:
				'Carded layout that spans the entire width of the content area with a dedicated header and 3 different scroll modes.',
			availableOptions: [
				{
					value: 'normalScroll',
					title: 'Normal Scroll'
				},
				{
					value: 'pageScroll',
					title: 'Page Scroll'
				},
				{
					value: 'contentScroll',
					title: 'Content Scroll'
				}
			],
			selectedOption: 'normalScroll',
			options: {
				normalScroll: {
					description: 'No scrolling area manipulations, entire viewport scrolls (body scroll).',
					link: '/documentation/user-interface/page-layouts/carded/full-width/normal-scroll',
					component: CardedFullWidthNormalScrollComponent
				},
				pageScroll: {
					description:
						'Only the page area scrolls making the main toolbar and footer to stick to the top and bottom of the viewport respectively.',
					link: '/documentation/user-interface/page-layouts/carded/full-width/page-scroll',
					component: CardedFullWidthPageScrollComponent
				},
				contentScroll: {
					description:
						'Only the content area of the page scrolls making everything else to stick into their positions.',
					link: '/documentation/user-interface/page-layouts/carded/full-width/content-scroll',
					component: CardedFullWidthContentScrollComponent
				}
			}
		},
		withSidebars: {
			title: 'Carded Page Layout With Sidebars',
			description: 'Layout with left and right sidebars, a dedicated header and 3 different scroll modes.',
			availableOptions: [
				{
					value: 'normalScroll',
					title: 'Normal Scroll'
				},
				{
					value: 'pageScroll',
					title: 'Page Scroll'
				},
				{
					value: 'contentScroll',
					title: 'Content Scroll'
				}
			],
			selectedOption: 'normalScroll',
			options: {
				normalScroll: {
					description: 'No scrolling area manipulations, entire viewport scrolls (body scroll).',
					link: '/documentation/user-interface/page-layouts/carded/with-sidebars/normal-scroll',
					component: CardedWithSidebarsNormalScrollComponent
				},
				pageScroll: {
					description:
						'Only the page area scrolls making the main toolbar and footer to stick to the top and bottom of the viewport respectively.',
					link: '/documentation/user-interface/page-layouts/carded/with-sidebars/page-scroll',
					component: CardedWithSidebarsPageScrollComponent
				},
				contentScroll: {
					description:
						'Only the content area of the page scrolls making everything else to stick into their positions.',
					link: '/documentation/user-interface/page-layouts/carded/with-sidebars/content-scroll',
					component: CardedWithSidebarsContentScrollComponent
				}
			}
		}
	},
	simple: {
		fullWidth: {
			title: 'Simple Full Width Page Layout',
			description:
				'Layout that spans the entire width of the content area with a dedicated header and 3 different scroll modes.',
			availableOptions: [
				{
					value: 'normalScroll',
					title: 'Normal Scroll'
				},
				{
					value: 'pageScroll',
					title: 'Page Scroll'
				},
				{
					value: 'contentScroll',
					title: 'Content Scroll'
				}
			],
			selectedOption: 'normalScroll',
			options: {
				normalScroll: {
					description: 'No scrolling area manipulations, entire viewport scrolls (body scroll).',
					link: '/documentation/user-interface/page-layouts/simple/full-width/normal-scroll',
					component: SimpleFullWidthNormalScrollComponent
				},
				pageScroll: {
					description:
						'Only the page area scrolls making the main toolbar and footer to stick to the top and bottom of the viewport respectively.',
					link: '/documentation/user-interface/page-layouts/simple/full-width/page-scroll',
					component: SimpleFullWidthPageScrollComponent
				},
				contentScroll: {
					description:
						'Only the content area of the page scrolls making everything else to stick into their positions.',
					link: '/documentation/user-interface/page-layouts/simple/full-width/content-scroll',
					component: SimpleFullWidthContentScrollComponent
				}
			}
		},
		withSidebars: {
			title: 'Simple Page Layout With Sidebars',
			description: 'Layout with left and right sidebars, a dedicated header and 3 different scroll modes.',
			availableOptions: [
				{
					value: 'normalScroll',
					title: 'Normal Scroll'
				},
				{
					value: 'pageScroll',
					title: 'Page Scroll'
				},
				{
					value: 'contentScroll',
					title: 'Content Scroll'
				}
			],
			selectedOption: 'normalScroll',
			options: {
				normalScroll: {
					description: 'No scrolling area manipulations, entire viewport scrolls (body scroll).',
					link: '/documentation/user-interface/page-layouts/simple/with-sidebars/normal-scroll',
					component: SimpleWithSidebarsNormalScrollComponent
				},
				pageScroll: {
					description:
						'Only the page area scrolls making the main toolbar and footer to stick to the top and bottom of the viewport respectively.',
					link: '/documentation/user-interface/page-layouts/simple/with-sidebars/page-scroll',
					component: SimpleWithSidebarsPageScrollComponent
				},
				contentScroll: {
					description:
						'Only the content area of the page scrolls making everything else to stick into their positions.',
					link: '/documentation/user-interface/page-layouts/simple/with-sidebars/content-scroll',
					component: SimpleWithSidebarsContentScrollComponent
				}
			}
		}
	}
};

export default pageLayoutOverviews;
