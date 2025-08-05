type DateString = string;

type DataPoint = {
	x: DateString;
	y: number;
};

type SeriesData = {
	name: string;
	data: DataPoint[];
};

type Series = Record<string, SeriesData[]>;

type Ranges = Record<string, string>;

/**
 * Visitors Overview Widget Type
 */
type VisitorsOverviewWidgetType = {
	ranges: Ranges;
	series: Series;
};

export default VisitorsOverviewWidgetType;
