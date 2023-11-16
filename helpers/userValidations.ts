export const validateName = (name: string): Boolean => {
	return name ? true : false;
};
export const validateDNI = (dni: number): Boolean => {
	return dni > 1000000 && dni < 100000000;
};
export const validateMail = (mail: string) => {
	return String(mail)
		.toLowerCase()
		.match(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};
