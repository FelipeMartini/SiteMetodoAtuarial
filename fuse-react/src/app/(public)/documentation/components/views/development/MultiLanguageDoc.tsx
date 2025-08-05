import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';
import i18Raw from '@i18n/i18n.ts?raw';
import i18nProviderRaw from '@i18n/I18nProvider.tsx?raw';
import enLangRaw from '@/app/(control-panel)/apps/mailbox/i18n/en.ts?raw';
import mailboxLocalizationRaw from '@/app/(control-panel)/apps/mailbox/i18n/index.ts?raw';

/**
 * Theme Layouts Doc
 * This document provides information on how to use theme layouts.
 */
function MultiLanguageDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Multi Language
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				Fuse React uses{' '}
				<a
					href="https://react.i18next.com/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<code>react-i18next</code>
				</a>{' '}
				for to support multiple languages.
			</Typography>

			<Typography
				className="mb-4 rounded-xl border-1 bg-yellow-50 p-4 text-gray-800"
				component="p"
			>
				Although most people don't require multi-language capabilities for their apps, we have chosen NOT to
				incorporate translations into every application. To get a glimpse of how translations work in practice,
				try visiting the Mail app and altering the language in the Toolbar. This is the only app specifically
				configured with translations for demonstration purposes. If you wish to delve into the details, you can
				review the source code for an example of how they are used.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Usage
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				To use the translations, create a translation file called <code>i18n/en.ts</code> within the folder of
				the app you would like to use them with. For example, to use the translations in the Mail app, create
				this file inside the <code>apps/mail</code> folder.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{enLangRaw}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="p"
			>
				And register the language file with <code>i18next.addResourceBundle()</code> at
				<code>src/app/(control-panel)/apps/mailbox/i18n/index.ts</code>
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{mailboxLocalizationRaw}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="p"
			>
				And use in a component with <code>useTranslation</code> hook as below:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{`
                        import {useTranslation} from 'react-i18next';

                        const {t} = useTranslation('mailApp');
                    
                        return (
                            <div className="p-6">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="w-full"
                                    onClick={handleOpenDialog}
                                >
                                    {t('COMPOSE')}
                                </Button>
                        `}
			</FuseHighlight>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Default Language
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				To change the default language of the Fuse React, you need to change <code>lng</code> setting in the
				file <code>@i18n/i18n.ts</code>
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				You can change "eng" value to "ar" to test it out.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{i18Raw}
			</FuseHighlight>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Changing Language
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				You should use <code>changeLanguage</code> in the hook to change language dynamically:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{`
import useI18n from '@i18n/useI18n';

const { changeLanguage } = useI18n();

const handleLanguageChange = async (newLanguageId) => {
  await changeLanguage(newLanguageId);
};
                        `}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="p"
			>
				Checkout example usage at
				<code>app/theme-layouts/components/LanguageSwitcher.tsx</code>
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				I18n Provider
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				Fuse React uses a custom I18nProvider to manage language settings and provide language-related
				functionality throughout the application. The I18nProvider is defined in{' '}
				<code>@i18n/I18nProvider.tsx</code>.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				Key features of the I18nProvider:
			</Typography>

			<ul className="mb-4 list-inside list-disc">
				<li>Manages available languages</li>
				<li>Provides current language and language direction</li>
				<li>Offers a function to change the current language</li>
				<li>Integrates with Fuse settings to update the layout direction</li>
			</ul>

			<Typography
				className="mb-4"
				component="p"
			>
				Here's the implementation of the I18nProvider:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-typescript mb-6"
			>
				{i18nProviderRaw}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="p"
			>
				To use the I18nProvider in your components, you can import and use the <code>useI18n</code> hook:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{`
import useI18n from '@i18n/useI18n';

function MyComponent() {
  const { language, changeLanguage, langDirection } = useI18n();

  return (
    <div>
      <p>Current language: {language.title}</p>
      <p>Language direction: {langDirection}</p>
      <button onClick={() => changeLanguage('ar')}>
        Switch to Arabic
      </button>
    </div>
  );
}
				`}
			</FuseHighlight>
		</>
	);
}

export default MultiLanguageDoc;
