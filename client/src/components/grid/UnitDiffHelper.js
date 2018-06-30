export default class UnitDiffHelper {
	static diffUnits(units, serverData) {
		const added = [];
		const modified = [];
		const deleted = [];

		serverData.forEach(unitInfo => {
			const result = units.find(x => x.userId === unitInfo.userId);

			if (result) {
				modified.push({
					unit: result,
					unitInfo
				});
			} else {
				added.push(unitInfo);
			}
		});

		units.forEach(unit => {
			const result = serverData.find(x => x.userId === unit.userId);

			if (!result) {
				deleted.push(unit);
			}
		});

		return {
			added,
			modified,
			deleted
		};
	}
}
