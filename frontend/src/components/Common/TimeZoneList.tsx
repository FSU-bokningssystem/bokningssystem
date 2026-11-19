const TimeZoneList = () => {
	const tzList = Intl.supportedValuesOf("timeZone");
	return (
		<>
			{tzList.map((timeZone) => (
				<option key={timeZone} value={timeZone}>
					{timeZone}
				</option>
			))}
		</>
	);
};
export default TimeZoneList;
