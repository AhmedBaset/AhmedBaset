const fs = require("fs").promises;
const path = require("path");
const { birthday } = require("../config");

(async () => {
  const age = calculateAge();
  const readmePath = path.join(process.cwd(), "README.md");

  const readmeContent = await fs.readFile(readmePath, "utf-8");
  const updatedContent = updateAgeInReadme(readmeContent, age);

  await fs.writeFile(readmePath, updatedContent);
  console.log("DONE");
})();

function calculateAge() {
  const today = new Date();
  const birth = new Date(birthday);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  if (days < 0) {
    const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0);
    days += prevMonth.getDate();
    months--;
  }

  return { years, months, days };
}

function updateAgeInReadme(content, age) {
  const { years, months, days } = age;
  const updatedDate = new Date().toLocaleString();

  const pattern = /age(:|\s?=)\s?(.+?)(";|",)/;
  const replacement = `age$1 "${years} years, ${months} months, and ${days} days$3 // Updated automatically on ${updatedDate}`;

  return content.replace(pattern, replacement);
}
