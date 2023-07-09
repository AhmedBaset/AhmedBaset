import fs from "fs/promises";
import path from "path";
import { user } from "../../config/user";

(async () => {
	const age = calculateAge();
	const templateReadme = path.join(process.cwd(), "templates", "README.md");
	const outputReadme = path.join(process.cwd(), "README.md");

	const readmeContent = await fs.readFile(templateReadme, "utf-8");
	const updatedContent = updateAgeInReadme(readmeContent, age);

	await fs.writeFile(outputReadme, updatedContent);
	console.log("DONE");
})();

function calculateAge() {
	const today = new Date();
	const birth = new Date(user.birthday);

	let years = today.getFullYear() - birth.getFullYear();
	let months = today.getMonth() - birth.getMonth();
	let days = today.getDate() - birth.getDate();

	if (months < 0 || (months === 0 && days < 0)) {
		years--;
		months += 12;
	}

	if (days < 0) {
		const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0);
		days = prevMonth.getDate() - birth.getDate() + today.getDate();
		months--;
	}

	return { years, months, days };
}

function updateAgeInReadme(
	content: string,
	age: { years: number; months: number; days: number }
) {
	const { years, months, days } = age;
	const updatedDate = new Date().toLocaleString("en", {
		timeZone: "Africa/Cairo",
		dateStyle: "long",
		timeStyle: "short",
	})

	//  const pattern = /age(:|\s?=)\s?(.+?)(;|,)\n/;
	const pattern = /<<age>>/s;
	// const replacement = `{\n    years: ${years},\n    months: ${months},\n    days: ${days}\n}; // Updated automatically on ${updatedDate} 👨🏻‍💻`;
	const replacement = `"${years} years, ${months} months, and ${days} days" // Updated automatically on ${updatedDate} 👨🏻‍💻`;

	return content.replace(pattern, replacement);
}
