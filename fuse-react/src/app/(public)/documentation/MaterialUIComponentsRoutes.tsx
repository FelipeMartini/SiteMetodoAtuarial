import { lazy } from 'react';
import { Navigate } from 'react-router';

const AccordionDoc = lazy(() => import('./components/views/material-ui-components/accordion/AccordionDoc'));
const AlertDoc = lazy(() => import('./components/views/material-ui-components/alert/AlertDoc'));
const AppBarDoc = lazy(() => import('./components/views/material-ui-components/app-bar/AppBarDoc'));
const AutocompleteDoc = lazy(() => import('./components/views/material-ui-components/autocomplete/AutocompleteDoc'));
const AvatarsDoc = lazy(() => import('./components/views/material-ui-components/avatars/AvatarsDoc'));
const BackdropDoc = lazy(() => import('./components/views/material-ui-components/backdrop/BackdropDoc'));
const BadgesDoc = lazy(() => import('./components/views/material-ui-components/badges/BadgesDoc'));
const BottomNavigationDoc = lazy(
	() => import('./components/views/material-ui-components/bottom-navigation/BottomNavigationDoc')
);
const BoxDoc = lazy(() => import('./components/views/material-ui-components/box/BoxDoc'));
const BreadcrumbsDoc = lazy(() => import('./components/views/material-ui-components/breadcrumbs/BreadcrumbsDoc'));
const ButtonGroupDoc = lazy(() => import('./components/views/material-ui-components/button-group/ButtonGroupDoc'));
const ButtonsDoc = lazy(() => import('./components/views/material-ui-components/buttons/ButtonsDoc'));
const CardsDoc = lazy(() => import('./components/views/material-ui-components/cards/CardsDoc'));
const CheckboxesDoc = lazy(() => import('./components/views/material-ui-components/checkboxes/CheckboxesDoc'));
const ChipsDoc = lazy(() => import('./components/views/material-ui-components/chips/ChipsDoc'));
const ContainerDoc = lazy(() => import('./components/views/material-ui-components/container/ContainerDoc'));
const CssBaselineDoc = lazy(() => import('./components/views/material-ui-components/css-baseline/CssBaselineDoc'));
const DialogsDoc = lazy(() => import('./components/views/material-ui-components/dialogs/DialogsDoc'));
const DividersDoc = lazy(() => import('./components/views/material-ui-components/dividers/DividersDoc'));
const DrawersDoc = lazy(() => import('./components/views/material-ui-components/drawers/DrawersDoc'));
const FloatingActionButtonDoc = lazy(
	() => import('./components/views/material-ui-components/floating-action-button/FloatingActionButtonDoc')
);
const GridDoc = lazy(() => import('./components/views/material-ui-components/grid/GridDoc'));
const GridLegacyDoc = lazy(() => import('./components/views/material-ui-components/grid-legacy/GridLegacyDoc'));
const ImageListDoc = lazy(() => import('./components/views/material-ui-components/image-list/ImageListDoc'));
const InitColorSchemeScriptDoc = lazy(
	() => import('./components/views/material-ui-components/init-color-scheme-script/InitColorSchemeScriptDoc')
);
const LinksDoc = lazy(() => import('./components/views/material-ui-components/links/LinksDoc'));
const ListsDoc = lazy(() => import('./components/views/material-ui-components/lists/ListsDoc'));
const MasonryDoc = lazy(() => import('./components/views/material-ui-components/masonry/MasonryDoc'));
const MenusDoc = lazy(() => import('./components/views/material-ui-components/menus/MenusDoc'));
const ModalDoc = lazy(() => import('./components/views/material-ui-components/modal/ModalDoc'));
const PaginationDoc = lazy(() => import('./components/views/material-ui-components/pagination/PaginationDoc'));
const PaperDoc = lazy(() => import('./components/views/material-ui-components/paper/PaperDoc'));
const PopoverDoc = lazy(() => import('./components/views/material-ui-components/popover/PopoverDoc'));
const PopperDoc = lazy(() => import('./components/views/material-ui-components/popper/PopperDoc'));
const ProgressDoc = lazy(() => import('./components/views/material-ui-components/progress/ProgressDoc'));
const RadioButtonsDoc = lazy(() => import('./components/views/material-ui-components/radio-buttons/RadioButtonsDoc'));
const RatingDoc = lazy(() => import('./components/views/material-ui-components/rating/RatingDoc'));
const SelectsDoc = lazy(() => import('./components/views/material-ui-components/selects/SelectsDoc'));
const SkeletonDoc = lazy(() => import('./components/views/material-ui-components/skeleton/SkeletonDoc'));
const SliderDoc = lazy(() => import('./components/views/material-ui-components/slider/SliderDoc'));
const SnackbarsDoc = lazy(() => import('./components/views/material-ui-components/snackbars/SnackbarsDoc'));
const SpeedDialDoc = lazy(() => import('./components/views/material-ui-components/speed-dial/SpeedDialDoc'));
const StackDoc = lazy(() => import('./components/views/material-ui-components/stack/StackDoc'));
const SteppersDoc = lazy(() => import('./components/views/material-ui-components/steppers/SteppersDoc'));
const SwitchesDoc = lazy(() => import('./components/views/material-ui-components/switches/SwitchesDoc'));
const TableDoc = lazy(() => import('./components/views/material-ui-components/table/TableDoc'));
const TabsDoc = lazy(() => import('./components/views/material-ui-components/tabs/TabsDoc'));
const TextFieldsDoc = lazy(() => import('./components/views/material-ui-components/text-fields/TextFieldsDoc'));
const TimelineDoc = lazy(() => import('./components/views/material-ui-components/timeline/TimelineDoc'));
const ToggleButtonDoc = lazy(() => import('./components/views/material-ui-components/toggle-button/ToggleButtonDoc'));
const TooltipsDoc = lazy(() => import('./components/views/material-ui-components/tooltips/TooltipsDoc'));
const TransferListDoc = lazy(() => import('./components/views/material-ui-components/transfer-list/TransferListDoc'));
const TransitionsDoc = lazy(() => import('./components/views/material-ui-components/transitions/TransitionsDoc'));
const TypographyDoc = lazy(() => import('./components/views/material-ui-components/typography/TypographyDoc'));

const MaterialUIComponentsRoutes = [
	{
		path: '',
		element: <Navigate to="accordion" />
	},
	{ path: 'accordion', element: <AccordionDoc /> },
	{ path: 'alert', element: <AlertDoc /> },
	{ path: 'app-bar', element: <AppBarDoc /> },
	{ path: 'autocomplete', element: <AutocompleteDoc /> },
	{ path: 'avatars', element: <AvatarsDoc /> },
	{ path: 'backdrop', element: <BackdropDoc /> },
	{ path: 'badges', element: <BadgesDoc /> },
	{ path: 'bottom-navigation', element: <BottomNavigationDoc /> },
	{ path: 'box', element: <BoxDoc /> },
	{ path: 'breadcrumbs', element: <BreadcrumbsDoc /> },
	{ path: 'button-group', element: <ButtonGroupDoc /> },
	{ path: 'buttons', element: <ButtonsDoc /> },
	{ path: 'cards', element: <CardsDoc /> },
	{ path: 'checkboxes', element: <CheckboxesDoc /> },
	{ path: 'chips', element: <ChipsDoc /> },
	{ path: 'container', element: <ContainerDoc /> },
	{ path: 'css-baseline', element: <CssBaselineDoc /> },
	{ path: 'dialogs', element: <DialogsDoc /> },
	{ path: 'dividers', element: <DividersDoc /> },
	{ path: 'drawers', element: <DrawersDoc /> },
	{ path: 'floating-action-button', element: <FloatingActionButtonDoc /> },
	{ path: 'grid', element: <GridDoc /> },
	{ path: 'grid-legacy', element: <GridLegacyDoc /> },
	{ path: 'image-list', element: <ImageListDoc /> },
	{ path: 'init-color-scheme-script', element: <InitColorSchemeScriptDoc /> },
	{ path: 'links', element: <LinksDoc /> },
	{ path: 'lists', element: <ListsDoc /> },
	{ path: 'masonry', element: <MasonryDoc /> },
	{ path: 'menus', element: <MenusDoc /> },
	{ path: 'modal', element: <ModalDoc /> },
	{ path: 'pagination', element: <PaginationDoc /> },
	{ path: 'paper', element: <PaperDoc /> },
	{ path: 'popover', element: <PopoverDoc /> },
	{ path: 'popper', element: <PopperDoc /> },
	{ path: 'progress', element: <ProgressDoc /> },
	{ path: 'radio-buttons', element: <RadioButtonsDoc /> },
	{ path: 'rating', element: <RatingDoc /> },
	{ path: 'selects', element: <SelectsDoc /> },
	{ path: 'skeleton', element: <SkeletonDoc /> },
	{ path: 'slider', element: <SliderDoc /> },
	{ path: 'snackbars', element: <SnackbarsDoc /> },
	{ path: 'speed-dial', element: <SpeedDialDoc /> },
	{ path: 'stack', element: <StackDoc /> },
	{ path: 'steppers', element: <SteppersDoc /> },
	{ path: 'switches', element: <SwitchesDoc /> },
	{ path: 'table', element: <TableDoc /> },
	{ path: 'tabs', element: <TabsDoc /> },
	{ path: 'text-fields', element: <TextFieldsDoc /> },
	{ path: 'timeline', element: <TimelineDoc /> },
	{ path: 'toggle-button', element: <ToggleButtonDoc /> },
	{ path: 'tooltips', element: <TooltipsDoc /> },
	{ path: 'transfer-list', element: <TransferListDoc /> },
	{ path: 'transitions', element: <TransitionsDoc /> },
	{ path: 'typography', element: <TypographyDoc /> }
];

export default MaterialUIComponentsRoutes;
