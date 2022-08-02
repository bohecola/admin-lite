export function useElTableApi({ refs }) {
	const clearSelection = () => {
		if (refs.value.table) {
			refs.value.table.clearSelection();
		}
	};

	const toggleRowSelection = (row, selected) => {
		if (refs.value.table) {
			refs.value.table.toggleRowSelection(row, selected);
		}
	};

	const toggleAllSelection = () => {
		if (refs.value.table) {
			refs.value.table.toggleAllSelection();
		}
	};

	const toggleRowExpansion = (row, expanded) => {
		if (refs.value.table) {
			refs.value.table.toggleRowExpansion(row, expanded);
		}
	};

	const setCurrentRow = (row) => {
		if (refs.value.table) {
			refs.value.table.setCurrentRow(row);
		}
	};

	const clearSort = () => {
		if (refs.value.table) {
			refs.value.table.clearSort();
		}
	};

	const clearFilter = (columnKey) => {
		if (refs.value.table) {
			refs.value.table.clearFilter(columnKey);
		}
	};

	const doLayout = () => {
		if (refs.value.table) {
			refs.value.table.doLayout();
		}
	};

	const sort = (props, orderprops) => {
		if (refs.value.table) {
			refs.value.table.sort(props, order);
		}
	};

	return {
		clearSelection,
		toggleRowSelection,
		toggleAllSelection,
		toggleRowExpansion,
		setCurrentRow,
		clearSort,
		clearFilter,
		doLayout,
		sort
	};
}
