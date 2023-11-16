export const stringDate = (date: number): string => {
	const _date = new Date(date);
	return `${_date.getDate()}/${_date.getMonth() + 1}/${_date.getFullYear()}`;
};
