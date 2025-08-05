import FuseLayout from '@fuse/core/FuseLayout';
import { SnackbarProvider } from 'notistack';
import themeLayouts from 'src/components/theme-layouts/themeLayouts';
import FuseSettingsProvider from '@fuse/core/FuseSettings/FuseSettingsProvider';
import { I18nProvider } from '@i18n/I18nProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale/en-US';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
import Authentication from '@auth/Authentication';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import MainThemeProvider from '../contexts/MainThemeProvider';
import routes from '@/configs/routesConfig';
import AppContext from '@/contexts/AppContext';
import { NotificationPanelContextProvider } from '@/app/(control-panel)/apps/notifications/contexts/NotificationPanelContext/NotificationPanelContextProvider';
import { FuseDialogContextProvider } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/FuseDialogContextProvider';
import { NavbarContextProvider } from '@/components/theme-layouts/components/navbar/contexts/NavbarContext/NavbarContextProvider';
import { QuickPanelProvider } from '@/components/theme-layouts/components/quickPanel/contexts/QuickPanelContext/QuickPanelContextProvider';
import RootThemeProvider from '@/contexts/RootThemeProvider';
import { NavigationContextProvider } from '@/components/theme-layouts/components/navigation/contexts/NavigationContextProvider';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			retry: 1
		}
	}
});

/**
 * The main App component.
 */
function App() {
	const AppContextValue = {
		routes
	};

	return (
		<ErrorBoundary>
			<AppContext value={AppContextValue}>
				{/* Date Picker Localization Provider */}
				<LocalizationProvider
					dateAdapter={AdapterDateFns}
					adapterLocale={enUS}
				>
					<QueryClientProvider client={queryClient}>
						<Authentication>
							<FuseSettingsProvider>
								<I18nProvider>
									{/* Theme Provider */}
									<RootThemeProvider>
										<MainThemeProvider>
											<NavbarContextProvider>
												<NavigationContextProvider>
													<FuseDialogContextProvider>
														{/* Notistack Notification Provider */}
														<SnackbarProvider
															maxSnack={5}
															anchorOrigin={{
																vertical: 'bottom',
																horizontal: 'right'
															}}
															classes={{
																containerRoot:
																	'bottom-0 right-0 mb-13 md:mb-17 mr-2 lg:mr-20 z-99'
															}}
														>
															<NotificationPanelContextProvider>
																<QuickPanelProvider>
																	<FuseLayout layouts={themeLayouts} />
																</QuickPanelProvider>
															</NotificationPanelContextProvider>
														</SnackbarProvider>
													</FuseDialogContextProvider>
												</NavigationContextProvider>
											</NavbarContextProvider>
										</MainThemeProvider>
									</RootThemeProvider>
								</I18nProvider>
							</FuseSettingsProvider>
						</Authentication>
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</LocalizationProvider>
			</AppContext>
		</ErrorBoundary>
	);
}

export default App;
