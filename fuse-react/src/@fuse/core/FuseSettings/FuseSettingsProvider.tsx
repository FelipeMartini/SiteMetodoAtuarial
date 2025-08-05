import { Component, ReactNode } from 'react';
import _ from 'lodash';
import { defaultSettings, getParsedQuerySettings } from '@fuse/default-settings';
import settingsConfig from 'src/configs/settingsConfig';
import themeLayoutConfigs from 'src/components/theme-layouts/themeLayoutConfigs';
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { getFuseRouteParamUtil } from '@fuse/hooks/useFuseRouteParameter';
import withRouter, { WithRouterProps } from '@fuse/core/withRouter/withRouter';
import withUser from '@auth/withUser';
import { User } from '@auth/user';
import { PartialDeep } from 'type-fest';
import FuseSettingsContext, { FuseSettingsContextType, FuseSettingsProviderState } from './FuseSettingsContext';

// Get initial settings
const getInitialSettings = (): FuseSettingsConfigType => {
	const defaultLayoutStyle = settingsConfig.layout?.style || 'layout1';
	const layout = {
		style: defaultLayoutStyle,
		config: themeLayoutConfigs[defaultLayoutStyle]?.defaults
	};
	return _.merge({}, defaultSettings, { layout }, settingsConfig, getParsedQuerySettings());
};

const initialSettings = getInitialSettings();

interface FuseSettingsProviderProps extends WithRouterProps {
	children: ReactNode;
	data: User;
}

const generateSettings = (
	_defaultSettings: FuseSettingsConfigType,
	_newSettings: PartialDeep<FuseSettingsConfigType>
) => {
	return _.merge(
		{},
		_defaultSettings,
		{ layout: { config: themeLayoutConfigs[_newSettings?.layout?.style]?.defaults } },
		_newSettings
	);
};
class FuseSettingsProvider extends Component<FuseSettingsProviderProps, FuseSettingsProviderState> {
	constructor(props: FuseSettingsProviderProps) {
		super(props);

		const userSettings = props?.data?.settings;

		const initial = _.merge({}, initialSettings, userSettings);

		this.state = {
			initial,
			defaults: _.merge({}, initial),
			data: _.merge({}, initial),
			userSettings
		};
	}

	static getDerivedStateFromProps(nextProps: FuseSettingsProviderProps, prevState: FuseSettingsProviderState) {
		const { data: user, location } = nextProps;

		const userSettingsChanged = !_.isEqual(user?.settings, prevState.userSettings);

		const defaults = userSettingsChanged
			? generateSettings(prevState.defaults, user?.settings)
			: prevState.defaults;

		const matchedSettings = getFuseRouteParamUtil(location.pathname, 'settings', true);

		const newSettings = _.merge({}, defaults, matchedSettings);

		return { ...prevState, data: newSettings, userSettings: user?.settings };
	}

	shouldComponentUpdate(nextProps: FuseSettingsProviderProps, nextState: { data: FuseSettingsConfigType }) {
		const { data } = this.state;
		return !_.isEqual(data, nextState.data);
	}

	setSettings = (newSettings: Partial<FuseSettingsConfigType>) => {
		const { defaults } = this.state;
		const newDefaults = generateSettings(defaults, newSettings);

		this.setState((prevState) => {
			return {
				...prevState,
				defaults: newDefaults
			};
		});

		return newDefaults;
	};

	render() {
		const { children } = this.props;
		const { data, initial, defaults } = this.state;
		const { setSettings } = this;

		const contextValue: FuseSettingsContextType = {
			data,
			initial,
			defaults,
			setSettings
		};

		return <FuseSettingsContext value={contextValue}>{children}</FuseSettingsContext>;
	}
}
const FuseSettingsProviderWithRouterUser = withRouter(withUser(FuseSettingsProvider));

export default FuseSettingsProviderWithRouterUser;
